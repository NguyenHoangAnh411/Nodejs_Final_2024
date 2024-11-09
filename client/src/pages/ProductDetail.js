import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../hooks/productApi';
import { getShopById } from '../hooks/shopApi';
import { getUserById } from '../hooks/userApi';
import { getReviewsByProductId, submitReview } from '../hooks/reviewApi';
import { addToCart } from '../hooks/cartApi';
import '../css/ProductDetail.css';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
function ProductDetail() {
  const { productId, shopId } = useParams(); 

  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [owner, setOwner] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        fetchRelatedProducts(productData.category);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchShop = async () => {
      try {
        const shopData = await getShopById(shopId);
        setShop(shopData);
        if (shopData.owner.ownerId) {
          const ownerData = await getUserById(shopData.owner.ownerId);
          setOwner(ownerData);
        }
      } catch (error) {
        console.error('Error fetching shop:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewData = await getReviewsByProductId(productId);
        setReviews(reviewData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
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

    fetchProduct();
    fetchShop();
    fetchReviews();
  }, [productId, shopId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReview = { productId, rating, comment: reviewText };
      await submitReview(productId, newReview);
      setReviews([...reviews, newReview]);
      setReviewText('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await addToCart(productId);
      if (response) {
        alert('Sản phẩm đã được thêm vào giỏ hàng');
      } else {
        alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng", error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  if (!product || !shop || !owner) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <Navbar />
      <Sidebar />
      <div className="main-content">
      <h2>{product.name}</h2>
      {product.images && product.images.length > 0 && (
        <img src={product.images[0]?.url} alt={product.name} className="product-image" />
      )}
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <button onClick={handleAddToCart} className="add-to-cart-button" disabled={loading}>
        {loading ? 'Đang thêm...' : 'Add to Cart'}
      </button>

      <div className="shop-info">
        <h3>Shop Information</h3>
        <p><strong>Shop Name:</strong> {shop.name}</p>
        <p><strong>Shop Description:</strong> {shop.description || "No description available."}</p>
        <p><strong>Contact:</strong> {owner?.phone || "No contact information."}</p>
      </div>

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
          <button type="submit">Submit Review</button>
        </form>

        <ul>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review, index) => (
              <li key={index}>
                <p><strong>Rating: {review.rating} Stars</strong></p>
                <p>{review.comment}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="related-products">
        <h3>Related Products</h3>
        <div className="related-products-list">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard 
              key={relatedProduct._id} 
              productId={relatedProduct._id} 
              shopId={relatedProduct.shopId} 
              productName={relatedProduct.name}
              productPrice={relatedProduct.price}
              productImage={relatedProduct.images[0]?.url || ''}
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default ProductDetail;
