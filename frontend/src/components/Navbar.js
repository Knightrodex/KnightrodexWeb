import React from 'react'
import { NavbarData } from './NavbarData';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="side-navbar">
      <nav className="nav-menu">
        <h1 className="navbar-title custom-login-title">Knightrodex</h1>
        <ul className="nav-menu-items">
          {NavbarData.map((item, index) => (
            <li key={index} className={item.cName}>
              <Link to={item.path}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

}

export default Navbar
