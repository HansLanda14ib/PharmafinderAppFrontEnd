import React, {useState, useEffect} from "react";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import "../../styles/editZone-modal.css";
import Map from "../Map/Map";
import {Form, Alert, Card, Row, Col} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBriefcaseMedical, faHistory} from "@fortawesome/free-solid-svg-icons";
import {Icon} from "leaflet/src/layer/marker";
import authHeader from "../../Services/auth-header";
import AuthService from "../../Services/auth.service";
import './cursor.css';

export default function OndutyAvailable() {
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [zones, setZones] = useState([]);
    const [mapModalIsOpen, setMapModalIsOpen] = useState(false);
    const [alt, setAlt] = useState('');
    const [long, setLong] = useState('');
    const [isNight, setIsNight] = useState(false);
    const location = useLocation();

    const now = new Date();
    const isNightTime = now.getHours() >= 23 || now.getHours() < 9;
    const isNow = location.pathname.includes("now");

    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);

        }

    }, []);

    useEffect(() => {
       // console.log(pharmacies);
    }, [pharmacies]);

    useEffect(() => {
            const fetchPharmacies = async () => {
                let result;
                // console.log(location.pathname);
                if (location.pathname.includes("now") && isNightTime) {
                    result = await axios.get("http://localhost:8080/api/v1/pharmaciesgarde/allDispoPharmacies/garde/2", {headers: authHeader()})
                } else if (location.pathname.includes("now") && !isNightTime) {
                    result = await axios.get("http://localhost:8080/api/v1/pharmaciesgarde/allDispoPharmacies/garde/1", {headers: authHeader()})
                } else {
                    result = await axios.get("http://localhost:8080/api/v1/pharmaciesgarde/allDispoPharmacies", {headers: authHeader()})

                }
                setPharmacies(result.data);
            }
            fetchPharmacies();

            const fetchZones = async () => {
                const result = await axios.get("http://localhost:8080/api/v1/zones", {headers: authHeader()})
                setZones(result.data);
            }
            fetchZones();

        }, // eslint-disable-next-line
        []);

    const showMap = (lal, long, pharmacy) => {
        setMapModalIsOpen(true);
        if (lal && long) {
            setAlt(lal);
            setLong(long);
            setSelectedPharmacy(pharmacy);
        }
    };
    const toggleIsNight = () => {
        setIsNight(!isNight);
    };
    const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/4287/4287703.png",
        iconSize: [38, 38],
    });

    const filteredPharmacies = isNight ? pharmacies.filter((pharmacy) => pharmacy.garde.type === "nuit") : pharmacies;

    return (<>
        {currentUser?.role === 'ADMIN' &&
            <Alert key='primary' variant='primary'>
                If want to see the history of On-duty Pharmacies : {' '}
                <Alert.Link as={Link} to="/ondutypharmacies/history"> click here<FontAwesomeIcon icon={faHistory}/></Alert.Link>
            </Alert>
        }
        {!isNow && (<Alert key='success' variant='success'>
            Find Open Pharmacies Now - See Who's On Duty Right Now !!{' '}
            <Alert.Link  as={Link} to="/ondutypharmacies/available/now"> click here<FontAwesomeIcon
                icon={faBriefcaseMedical}/></Alert.Link>
        </Alert>)}

        <div className='container'><h1>On-duty Pharmacies: </h1>
            {isNow ? (<h4>
                {isNightTime ? (<span><h4>
               Night Shift : From 11 PM to 9 AM WITHOUT INTERRUPTION
            </h4> </span>) : (<span> <h4>
              Day Shift : From 9 AM to 11 PM WITHOUT INTERRUPTION
            </h4> </span>)}

            </h4>) : (<span></span>)}
        </div>
        <div className="pharmacies-container">
            {!isNow && (
                <Form>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        checked={isNight} onChange={toggleIsNight}
                        label="Pharmacies open at night"
                    />
                </Form>
            )}

            {filteredPharmacies.length > 0 ? (
                <Card style={{backgroundColor: 'transparent'}} >
                    <Card.Body  style={{backgroundColor: 'transparent',borderRadius: "10px"}}>
                        <Row>
                            {filteredPharmacies.map((pharmacy) => (
                                <Col key={pharmacy.pharmacy.id} xs={12} md={6} lg={4}>
                                    <Card  style={{backgroundColor: 'transparent'}}>
                                        <Card.Body style={{color: 'white',backgroundColor: '#246d7d',borderRadius: "10px"}}>
                                            <Card.Title>{pharmacy.pharmacy.name.toUpperCase()}</Card.Title>
                                            <Card.Text>Address: {pharmacy.pharmacy.address}

                                                {pharmacy.altitude !== 0 && pharmacy.longitude !== 0 && (
                                                    <Card.Link
                                                        className="location-link">

                                                        <img width={customIcon.options.iconSize[0]} height={customIcon.options.iconSize[1]}
                                                             src={customIcon.options.iconUrl} alt="Location Icon"
                                                             onClick={() => showMap(pharmacy.pharmacy.altitude, pharmacy.pharmacy.longitude, pharmacy.pharmacy)
                                                             }
                                                        />
                                                    </Card.Link>
                                                )}

                                            </Card.Text>


                                            <Card.Text>Phone Number: {pharmacy.pharmacy.phone}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
                ) : (<p>No On-duty pharmacies found.</p>)}
            <Modal show={mapModalIsOpen} onHide={() => {
                setMapModalIsOpen(false)
            }}
                   size='xl'
                   aria-labelledby="contained-modal-title-vcenter"
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Pharmacy on Map</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map center={[alt, long]} selectedPharmacy={selectedPharmacy}/>
                </Modal.Body>


            </Modal>

        </div>
    </>)

}