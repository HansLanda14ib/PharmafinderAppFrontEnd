import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import '../../styles/navigation.css'
import AuthService from "../../Services/auth.service";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarWeek,
    faCircleUser,
    faCity, faClock, faClockRotateLeft, faFilter, faGears, faHospitalUser,
    faHouse, faLayerGroup,
    faList, faMap,
    faMoon,
    faRightFromBracket,
    faStore
} from "@fortawesome/free-solid-svg-icons";

const Navigation = ({currentUser}) => {

    const [showAdminLinks, setShowAdminLinks] = useState(false);
    const [showUserLinks, setShowUserLinks] = useState(false);
    useEffect(() => {

        if (currentUser?.role === 'ADMIN') {
            setShowAdminLinks(true);
            setShowUserLinks(false);
        } else {
            setShowAdminLinks(false)
            setShowUserLinks(true)
        }

    }, [currentUser?.role]);


    const logOut = () => {
        AuthService.logout();

    };

    return (
        <Container style={{backgroundColor: "#001e28"}}>
            <Navbar style={{backgroundColor: "#001e28"}} expand="lg" >
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt=""
                            src="/src/images/logo.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        <span id="nav-dropdown">PharmaFinder</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{maxHeight: '100px'}}
                            navbarScroll
                        >

                            <Nav.Link id="nav-dropdown" as={Link} to="/"> <FontAwesomeIcon icon={faHouse}/> Home</Nav.Link>

                            {currentUser?.role !== 'OWNER' ? (
                                <>
                                    <NavDropdown id="nav-dropdown"  title={<span><FontAwesomeIcon icon={faStore} /> Pharmacies</span>}>
                                        <NavDropdown.Item as={Link} to="/pharmacies"><FontAwesomeIcon icon={faList} /> List of
                                            Pharmacies</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/map"><FontAwesomeIcon icon={faMap} /> Pharmacies on Map</NavDropdown.Item>

                                    </NavDropdown>
                                    {showAdminLinks && (

                                        <NavDropdown id="nav-dropdown"  title={<span><FontAwesomeIcon icon={faGears} /> Cities/Zones</span>}>
                                            <NavDropdown.Item as={Link} to="/cities"><FontAwesomeIcon icon={faCity} /> Cities</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/zones"><FontAwesomeIcon icon={faLayerGroup} /> Zones</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/zonesbycity"><FontAwesomeIcon icon={faFilter} />List of
                                                Pharmacies by
                                                Zone</NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                    {showAdminLinks && (
                                        <NavDropdown id="nav-dropdown"  title={<span><FontAwesomeIcon icon={faMoon} /> 24/7 Pharmacies</span>}>
                                            <NavDropdown.Item as={Link}
                                                              to="/ondutypharmacies/history"><FontAwesomeIcon icon={faClockRotateLeft} /> History</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/ondutypharmacies/available"><FontAwesomeIcon icon={faCalendarWeek} /> Available this
                                                week</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/ondutypharmacies/available/now"><FontAwesomeIcon icon={faClock} /> Available
                                                Now</NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                    {(showUserLinks) && (
                                        <NavDropdown id="nav-dropdown"  title={<span><FontAwesomeIcon icon={faMoon} /> 24/7 Pharmacies</span>}>
                                            <NavDropdown.Item as={Link} to="/ondutypharmacies/available"><FontAwesomeIcon icon={faCalendarWeek} /> Available this
                                                week</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/ondutypharmacies/available/now"><FontAwesomeIcon icon={faClock} />Available
                                                Now</NavDropdown.Item>
                                        </NavDropdown>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Nav.Link id="nav-dropdown" as={Link} to="/pharmacy"><FontAwesomeIcon icon={faHospitalUser} /> My pharmacy</Nav.Link>
                                    <Nav.Link id="nav-dropdown" as={Link} to="/ondutypharmacy"><FontAwesomeIcon icon={faMoon} />24/7 Onduty
                                    </Nav.Link>
                                </>
                            )}

                        </Nav>
                        <Nav>
                            {currentUser ? (
                                <>

                                    <Nav.Link id="nav-dropdown" as={Link} to="/profile">
                                        <FontAwesomeIcon
                                            icon={faCircleUser}/> Profile
                                    </Nav.Link>
                                    <Nav.Link id="nav-dropdown" onClick={logOut}
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket}/> Log out : @{currentUser.lastName}</Nav.Link>

                                </>
                            ) : (
                                <>
                                    <Nav.Link id="nav-dropdown" as={Link} to="/login"
                                    >Login</Nav.Link>
                                    <Nav.Link id="nav-dropdown" as={Link} to="/register"
                                    >Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </Container>
    );
};

export default Navigation;
