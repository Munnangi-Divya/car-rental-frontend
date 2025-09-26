
import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Jerry Car Rental</Link>
      </div>

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-right ${menuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            <span className="user-name">{user.name} ({user.role})</span>
            {user.role === 'customer' && <Link to="/">Home</Link>}
            {user.role === 'customer' && <Link to="/history">My Bookings</Link>}
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

