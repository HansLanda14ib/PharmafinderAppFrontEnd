import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faLaptopMedical, faMap, faMoon,faCity,faNetworkWired   } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/pharmafinderLogo.png';
import '../../styles/LeftNav.css';



const Menu = () => {
    const [isOpen, setIsOpen] = useState(true);

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
                    <li> {/* onClick={toggleNav} */}
                        <Link to="/map" >
                            <FontAwesomeIcon icon={faMap} />
                            <span>PharmaMap</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/ondutypharmacies/available" >

                            <FontAwesomeIcon icon={faMoon} />
                            <span>On-duty Pharmacies</span>
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
                <p>&copy; 2023 Pharma Finder By HansLanda14ib</p>
            </footer>
        </>
    );
};

export default Menu;
