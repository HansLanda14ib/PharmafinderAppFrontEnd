import {useMatch, Link, useParams, useNavigate, useLocation} from 'react-router-dom';
import {Badge, DropdownButton, Nav} from 'react-bootstrap';
import {useEffect, useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
 const  MyNav= (props) => {
    const match = useMatch('/test/:id');
    const { id } = useParams();


    //The useLocation Hook allows you to access the location object that represents the active URL.
    // The value of the location object changes whenever the user navigates to a new URL.
    const location = useLocation();


/* The useNavigate Hook returns a function that lets you handle route changes and navigate programmatically: */
    let navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };
    const handleNavigation = () => {
        navigate("/test/5");
    };
    console.log(match);

    useEffect(() => {
      //  console.log(location);
        // Send request to your server to increment page view count
    }, [location]);

        const [pharmacyState, setPharmacyState] = useState('waiting');

        const handleStateChange = (newState) => {
            setPharmacyState(newState);
        };
    return (
        <>

            <div>
                <h2>Pharmacy</h2>
                <p>State: <Badge variant={pharmacyState === 'waiting' ? 'warning' : pharmacyState === 'accept' ? 'success' : 'danger'}>{pharmacyState}</Badge></p>
                <DropdownButton id="dropdown-basic-button" title="Change state">
                    <Dropdown.Item onClick={() => handleStateChange('waiting')}>Waiting</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStateChange('accept')}>Accept</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleStateChange('refuse')}>Refuse</Dropdown.Item>
                </DropdownButton>
            </div>

            <Nav>
                <Nav.Link as={Link} to="/home" active={Boolean(useMatch('/home'))}>
                    Home
                </Nav.Link>
                <Nav.Link as={Link} to="/pharmacies" active={Boolean('/pharmacies')}>
                    pharmacies
                </Nav.Link>
                <Nav.Link as={Link} to="/cities" active={Boolean(useMatch('/cities'))}>
                    cities
                </Nav.Link>
            </Nav>

            <div>
                <div>This is the user page</div>
                <div>current user Id - {id}</div>
                <div>
                    <button onClick={handleBack}>Go Back</button>
                </div>
                <div>
                    <button onClick={handleNavigation}>Go To Different User</button>
                </div>
            </div>
        </>


    );
}
export default MyNav;