import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import '../../styles/LeftNav.css';
import firstPicture from '../../images/homepageimage.png'
import AuthService from "../../Services/auth.service";


const Home = () => {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);

        }

    }, []);
    return (
        <>

            <div className="home-container">
                <h1>Welcome to Pharma Finder</h1>
                {currentUser?.role !== 'OWNER' ? (

                    <div>
                        <h3>Find Open Pharmacies Now</h3>

                        <Link as={Link} to="/ondutypharmacies/available/now">
                            <button>See Who's On Duty Right Now !!</button>
                        </Link>


                    </div>

                ) : (<div>
                        <h3>Welcome to PharmaFinder App</h3>
                        <Link as={Link} to="/pharmacy">
                            <button>Click Here to Update your Pharma infos!!</button>
                        </Link>
                    </div>
                )}
                <img src={firstPicture} style={{width: '400px', height: 'auto'}} alt="Pharma Finder"
                />
            </div>


        < />
    );
};

export default Home;
