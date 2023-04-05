import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLaptopMedical, faMap, faMoon,faCity,faNetworkWired   } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/pharmafinderLogo.png';
import '../styles/LeftNav.css';


const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>

            <button className={`nav-toggle ${isOpen ? 'open' : ''}`} onClick={toggleNav}>
                <div className="hamburger"></div>
            </button>
            <nav className={`left-nav ${isOpen ? 'open' : ''}`}>
                <div className="logo">

                    <img src={logo} alt="Pharma Finder Logo" />
                </div>
                <ul>
                    <li>
                        <Link to="/home" >
                            <FontAwesomeIcon icon={faHome} />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/pharmacies" >
                            <FontAwesomeIcon icon={faLaptopMedical} />
                            <span>Pharmacies</span>

                        </Link>
                    </li>
                    <li>
                        <Link to="/map" onClick={toggleNav}>
                            <FontAwesomeIcon icon={faMoon} />
                            <span>PharmaMap</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/" >
                            <FontAwesomeIcon icon={faMap} />
                            <span>24/24 Pharmacies</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/cities" >
                            <FontAwesomeIcon icon={faCity } />
                            <span>Cities</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/zones" >
                            <FontAwesomeIcon icon={ faNetworkWired} />
                            <span>Zones</span>
                        </Link>
                    </li>

                </ul>

            </nav>
            <footer className="footer">
                <p>&copy; 2023 Pharma Finder</p>
            </footer>
        </>
    );
};

export default Menu;
