import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {FormControl, FormGroup} from "react-bootstrap";
import axios from "axios";
import Notiflix from "notiflix";
import MapComponent from "../Map/MapComponent";
import authHeader from "../../Services/auth-header";
import AuthService from "../../Services/auth.service";


function CreatePharmacy(props) {
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [phone,setPhone] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [altitude, setAltitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [cityId, setCityId] = useState("");
    const [zones, setZones] = useState([]);
    const [cities, setCities] = useState([]);

    const [nameError, setNameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [zoneError, setZoneError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);

        }

    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/cities", {headers: authHeader()}).then((response) => {
            setCities(response.data);
        });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const pharmacy = {
            name: name, address: address, phone: phone,altitude: altitude, longitude: longitude, zone: {
                id: zoneId,
            }
        };
        console.log(pharmacy);
        await axios.post("http://localhost:8080/api/v1/pharmacies/save", pharmacy, {headers: authHeader()})
            .then(response => {
                Notiflix.Notify.success("Pharmacy added successfully");
                setShowModalCreate(false);
                // update list of pharmacies in main page component
                props.onAddPharmacy(response.data);
                // clear form fields
                setName('');
                setPhone('');
                setAddress('');
                setCityId('');
                setZoneId('');
                setZoneError('');
                setNameError('');
                setPhoneError('');
                setAddressError('');
                setAltitude('');
                setLongitude('');
                setShowMap(false);
            })
            .catch((error) => {
                const errors = error.response.data;
                setNameError(errors.name);
                setAddressError((errors.address));
                setZoneError(errors.zone);
                setPhoneError(errors.phone);
            });
    };

    const handleCoordsSelected = (coords) => {
        setAltitude(coords[0]);
        setLongitude(coords[1]);
    };

    const handleCityChange = (e) => {
        const cityId = e.target.value;
        setCityId(cityId);
        axios.get(`http://localhost:8080/api/v1/zones/zone/city=${cityId}`, {headers: authHeader()})
            .then((response) => {
                setZones(response.data);
            });
    };

    const handleShowMapChange = (e) => {
        setShowMap(e.target.checked);
    };
    const handleCloseModalCreate = () => setShowModalCreate(false);
    const handleShowModalCreate = () => setShowModalCreate(true);

    return (
        <>
            {currentUser && currentUser?.role === 'ADMIN' &&
                <Button style={{backgroundColor: "#0f2d37"}} onClick={handleShowModalCreate}>
                    Add Pharmacy
                </Button>}

            <Modal size="lg" show={showModalCreate} onHide={handleCloseModalCreate}
                   aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header closeButton>
                    <Modal.Title>Add new pharmacy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <FormGroup>
                            <Form.Label>Name</Form.Label>
                            <FormControl type="name" placeholder="" value={name} required
                                         onChange={(e) => setName(e.target.value)}/>
                            <div className="text-danger">{nameError}</div>
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Address</Form.Label>
                            <FormControl type="address" placeholder="" value={address} required
                                         onChange={(e) => setAddress(e.target.value)}/>
                            <div className="text-danger">{addressError}</div>
                        </FormGroup>

                        <FormGroup>
                            <Form.Label>Phone Number</Form.Label>
                            <FormControl type="name" placeholder="" value={phone} required
                                         onChange={(e) => setPhone(e.target.value)}/>
                            <div className="text-danger">{phoneError}</div>
                        </FormGroup>

                        <FormGroup>
                            <Form.Label>Altitude</Form.Label>
                            <FormControl type="altitude" placeholder="" value={altitude} disabled required/>
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Longitude</Form.Label>
                            <FormControl type="longitude" placeholder="" value={longitude} required disabled/>
                        </FormGroup>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Select id="cityId"
                                         value={cityId}
                                         onChange={handleCityChange}>
                                <option>select city</option>
                                {cities && cities.map((city) => (<option key={city.id} value={city.id}>
                                    {city.name}
                                </option>))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Zone</Form.Label>
                            <Form.Select id="zoneId"
                                         value={zoneId}
                                         onChange={(e) => setZoneId(e.target.value)}>
                                <option>select zone</option>
                                {zones && zones.map((zone) => (<option key={zone.id} value={zone.id}>
                                    {zone.name}
                                </option>))}

                            </Form.Select>
                            <div className="text-danger">{zoneError}</div>
                        </Form.Group>

                        <Form.Check type="checkbox" label="Show Map" checked={showMap} onChange={handleShowMapChange}/>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalCreate}>
                        Close
                    </Button>
                    <Button type="submit" variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                    {showMap &&
                        <div><MapComponent onSelect={handleCoordsSelected} center={props.currentLocation}/></div>}
                </Modal.Footer>
            </Modal>

        </>);
}

export default CreatePharmacy;