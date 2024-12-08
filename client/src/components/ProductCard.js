import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ProductCard.css';
import { getProductById } from '../hooks/productApi';

function ProductCard({ productId }) {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
  
    fetchProduct();
  }, [productId]);

  if (!product) return <p>Loading product...</p>;

  const truncatedDescription = product.description.length > 50 
    ? `${product.description.substring(0, 50)}...` 
    : product.description;

  return (
    <div className="product-card" onClick={() => navigate(`/product/${productId}`)}>
      {product.images && product.images.length > 0 ? (
        <img src={product.images[0]?.url} alt={product.name} />
      ) : (
        <img src="default-image-url.jpg" alt="Default" />
      )}
      <h5>{product.name}</h5>
      <strong>Price:</strong> {`${(product.price).toLocaleString('vi-VN')} VND`}
      <p><strong>Description:</strong> {truncatedDescription}</p>
    </div>
  );
}

export default ProductCard;
