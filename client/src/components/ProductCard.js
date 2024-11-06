// src/components/ProductCard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ProductCard.css';

function ProductCard({ productId, shopId }) {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
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
    <div className="product-card" onClick={() => navigate(`/product/${productId}/${shopId}`)}>
      {product.images && product.images.length > 0 ? (
        <img src={product.images[0]?.url} alt={product.name} />
      ) : (
        <img src="default-image-url.jpg" alt="Default" />
      )}
      <h5>{product.name}</h5>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Description:</strong> {truncatedDescription}</p>
    </div>
  );
}

export default ProductCard;
