import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import React from "react";
import logo from '../../images/logo.ico'

const Navigation = () => {
    return (

        <Navbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Pharma Finder
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarScroll"/>
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                        <Nav.Link href="/home">Home</Nav.Link>
                        <NavDropdown title="Pharmacies" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="/pharmacies">List of Pharmacies</NavDropdown.Item>
                            <NavDropdown.Item href="/map">Pharmacies on Map</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Cities/Zones" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="/cities">Cities</NavDropdown.Item>
                            <NavDropdown.Item href="/zones">Zones</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="On-duty Pharmacies" id="navbarScrollingDropdown">
                            <NavDropdown.Item href="/ondutypharmacies/history">History</NavDropdown.Item>
                            <NavDropdown.Item href="/ondutypharmacies/available">Available this week</NavDropdown.Item>
                            <NavDropdown.Item href="/ondutypharmacies/available/now">Available Now</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/about">About Us</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

}

export default Navigation