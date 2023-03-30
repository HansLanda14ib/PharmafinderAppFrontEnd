import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <header>
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <a class="navbar-brand" href="http://localhost:3000/">
              <img
                src="/logopharmafinder.png"
                height="40"
                alt="Pharma Finder App"
              />
            </a>

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" activeClassName="active">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/villes"
                  activeClassName="active"
                >
                  Villes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/zones"
                  activeClassName="active"
                >
                  Zones
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/pharmacies"
                  activeClassName="active"
                >
                  Pharmacies
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    );
  }
}

export default HeaderComponent;
