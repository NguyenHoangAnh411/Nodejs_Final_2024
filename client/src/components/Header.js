import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">My E-Commerce</Link>
      </div>
      <SearchBar />
      <nav>
        <Link to="/profile">Profile</Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  );
}

export default Header;
