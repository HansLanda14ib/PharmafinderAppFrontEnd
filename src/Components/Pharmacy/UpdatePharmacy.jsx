import React, {useEffect, useState} from 'react';
import {Modal, Button, Form, FormGroup, FormControl} from 'react-bootstrap';
import axios from "axios";
import MapComponent from "../Map/MapComponent";
import Notiflix from "notiflix";
import authHeader from "../../Services/auth-header";

const UpdatePharmacy = ({currentLocation, showModal, onHide, pharmacy, updatePharmacy}) => {
    const [updatedPharmacy, setUpdatedPharmacy] = React.useState(pharmacy);
    // eslint-disable-next-line no-unused-vars
    const [id, setId] = useState(updatedPharmacy?.id);
    // eslint-disable-next-line no-unused-vars
    const [state, setState] = useState(updatedPharmacy?.state);
    const [name, setName] = useState(updatedPharmacy?.name);
    const [phone, setPhone] = useState(updatedPharmacy?.phone);
    const [address, setAddress] = useState(updatedPharmacy?.address);
    const [altitude, setAltitude] = useState(updatedPharmacy?.altitude);
    const [longitude, setLongitude] = useState(updatedPharmacy?.longitude);
    const [zoneId, setZoneId] = useState(updatedPharmacy?.zone.id);
    // eslint-disable-next-line no-unused-vars
    const [zoneName, setZoneName] = useState(updatedPharmacy?.zone.name);
    const [showMap, setShowMap] = useState(false);
    const [zones, setZones] = useState([]);

    useEffect(() => {
        setUpdatedPharmacy(pharmacy);
    }, [pharmacy]);

    useEffect(() => {
        const fetchZones = async () => {
            const result = await axios.get("http://localhost:8080/api/v1/zones",{ headers: authHeader() })
            setZones(result.data);
            console.log(result.data);
        }
        fetchZones();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pharmacy = {
            id: id, state: state,
            name: name, address: address,phone:phone, altitude: altitude, longitude: longitude, zone: {
                id: zoneId, name: zoneName
            }
        };

        setUpdatedPharmacy(pharmacy);
        try {

            // eslint-disable-next-line no-unused-vars
            const response = await axios.put(`http://localhost:8080/api/v1/pharmacies/${updatedPharmacy.id}/update`, pharmacy,{ headers: authHeader() });
            updatePharmacy(pharmacy);
            Notiflix.Notify.success("Pharmacy has been updated");
            onHide();

        } catch (error) {
            console.log(error.response.data);
            Notiflix.Notify.failure("Failed to update Pharmacy");
        }

    };
    const handleShowMapChange = (e) => {
        setShowMap(e.target.checked);
    };
    const handleCoordsSelected = (coords) => {
        setAltitude(coords[0]);
        setLongitude(coords[1]);
    };
    return (
        <Modal show={showModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Pharmacy</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>

                    <FormGroup>
                        <Form.Label>Name</Form.Label>
                        <FormControl type="name" placeholder="" value={name} required
                                     onChange={(e) => setName(e.target.value)}/>

                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Address</Form.Label>
                        <FormControl type="address" placeholder="" value={address} required
                                     onChange={(e) => setAddress(e.target.value)}/>

                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Phone Number</Form.Label>
                        <FormControl type="text" placeholder="" value={phone} required
                                     onChange={(e) => setPhone(e.target.value)}/>

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
                        <Form.Label>Zone</Form.Label>
                        <Form.Select id="zoneId"
                                     value={zoneId}
                                     onChange={(e) => setZoneId(e.target.value)}>
                            <option>select zone</option>
                            {zones && zones.map((zone) => (<option key={zone.id} value={zone.id}>
                                {zone.name}
                            </option>))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Check type="checkbox" label="Show Map" checked={showMap} onChange={handleShowMapChange}/>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button type="submit" variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
                {showMap && <div><MapComponent onSelect={handleCoordsSelected} center={[pharmacy.altitude,pharmacy.longitude]}/></div>}
            </Modal.Footer>
        </Modal>
    );
};
export default UpdatePharmacy;
