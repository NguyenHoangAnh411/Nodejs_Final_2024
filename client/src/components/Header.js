import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <style>
        {`
          .menu-button {
            display: none;
          }

          @media (max-width: 768px) {
            .menu-button {
              display: block;
            }

            nav {
              display: none;
              flex-direction: column;
              align-items: center;
            }

            nav.open {
              display: flex;
            }
          }
        `}
      </style>
      <header className="header">
        <div className="logo">
          <Link to="/">My E-Commerce</Link>
        </div>
        <SearchBar />
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={isMenuOpen ? 'open' : 'closed'}>
          <Link to="/profile">Profile</Link>
          <Link to="/cart">Cart</Link>
        </nav>
      </header>
    </>
  );
}

export default Header;
