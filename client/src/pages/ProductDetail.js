import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts, getCommentsForProduct, addCommentToProduct, deleteCommentFromProduct } from '../hooks/productApi';
import { addToCart } from '../hooks/cartApi';
import useUserProfile from '../hooks/userinfomation';
import '../css/ProductDetail.css';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';

function ProductDetail() {
  const { productId } = useParams();
  const { userData } = useUserProfile();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        fetchRelatedProducts(productData.category);
        fetchComments();
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchRelatedProducts = async (category) => {
      try {
        const relatedData = await getRelatedProducts(category);
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentData = await getCommentsForProduct(productId);
        setReviews(commentData.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (reviewText.trim() === '' || rating < 1 || rating > 5) {
      alert('Vui lòng điền đầy đủ thông tin bình luận và xếp hạng.');
      setIsSubmitting(false);
      return;
    }

    const newReview = {
      productId,
      content: reviewText,
      rating,
      user: userData,
    };

    try {
      const addedReview = await addCommentToProduct(productId, newReview);
      setReviews((prevReviews) => [addedReview, ...prevReviews]);
      setReviewText('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error.message);
      alert('Có lỗi khi gửi bình luận.');
    } finally {
      setIsSubmitting(false);
    }
  }, [reviewText, rating, userData, productId]);

  const handleDeleteComment = useCallback(async (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bình luận này?')) {
      try {
        await deleteCommentFromProduct(productId, commentId);
        setReviews((prevReviews) => prevReviews.filter((review) => review._id !== commentId));
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Có lỗi khi xoá bình luận.');
      }
    }
  }, [productId]);

  const handleAddToCart = async () => {
    setLoading(true);
    
    try {
      if (userData) {
        const response = await addToCart(productId);
        if (response) {
          alert('Sản phẩm đã được thêm vào giỏ hàng.');
        } else {
          alert('Lỗi khi thêm sản phẩm vào giỏ hàng.');
        }
      } else {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productToAdd = { productId, quantity: 1 };
        cart.push(productToAdd);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Sản phẩm đã được thêm vào giỏ hàng tạm thời.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Có lỗi khi thêm sản phẩm vào giỏ hàng.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <Sidebar />
      <div className="main-content">
        <h2>{product.name}</h2>
        {product.images && product.images.length > 0 && (
          <img src={product.images[0]?.url} alt={product.name} className="product-image" />
        )}
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <button onClick={handleAddToCart} className="add-to-cart-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>

        <div className="reviews-section">
          <h3>Reviews</h3>

          <form onSubmit={handleReviewSubmit}>
            <label>
              Rating:
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating >= star ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          <ul>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <li key={index}>
                  <p><strong>Rating: {review.rating} Stars</strong></p>
                  <p>{review.content}</p>
                  <p><strong>Reviewed by:</strong> {review.user?.name || 'Anonymous'}</p>
                  {userData && userData._id === review.user?._id && (
                    <button onClick={() => handleDeleteComment(review._id)}>Delete Comment</button>
                  )}
                </li>
              ))
            )}
          </ul>

        </div>

        <div className="related-products">
          <h3>Related Products</h3>
          <div className="related-products-list">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} productId={relatedProduct._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
