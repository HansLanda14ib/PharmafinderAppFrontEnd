import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/LeftNav.css';
import firstPicture from '../../images/homepageimage.png'

const Home = () => {
    return (
<>
        <div className="home-container">
            <h1>Welcome to Pharma Finder</h1>
            <h3>Find Open Pharmacies Now</h3>

            <Link to="/ondutypharmacies/available/now">
                <button>See Who's On Duty Right Now !!</button>
            </Link>
            <a href='/ondutypharmacies/available/now'>
                <img src={firstPicture} style={{ width: '400px', height: 'auto' }} alt="Pharma Finder"
                />
            </a>

        </div>
</>
    );
};

export default Home;
