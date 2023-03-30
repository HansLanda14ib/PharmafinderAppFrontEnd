import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark">
      <nav className="container-fluid">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink className="nav-link" to="/" activeClassName="active">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/" activeClassName="active">
              City
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/zone" activeClassName="active">
              Zone
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/zoneByCity" activeClassName="active">
              Zone by City
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/pharmacie" activeClassName="active">
              Pharmacies
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

const Footer = () => {
  return (
    <footer className="bg-dark text-center text-bg-dark">
      <p className="text-center p-3">© {new Date().getFullYear()} PharmaFinder App</p>
    </footer>
  );
};

export { Header, Footer };