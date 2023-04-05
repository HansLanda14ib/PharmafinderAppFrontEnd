import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LeftNav.css';
import firtPicture from '../images/homepageimage.png'
const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Pharma Finder</h1>
            <p>Find pharmacies near you, anytime.</p>
            <Link to="/map">
                <button>Find Pharmacies</button>
            </Link>
            <img src={firtPicture} style={{ width: '600px', height: 'auto' }} alt="Pharma Finder" />
        </div>
    );
};

export default Home;
