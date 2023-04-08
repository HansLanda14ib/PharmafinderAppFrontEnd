import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Button, Form, FormGroup, FormControl} from 'react-bootstrap';
import axios from "axios";
import MapComponent from "./MapComponent";
import Notiflix from "notiflix";

const UpdateForm = ({currentLocation,showModal, onHide, pharmacy, updatePharmacy}) => {
    const [updatedPharmacy, setUpdatedPharmacy] = React.useState(pharmacy);
    const [id, setId] = useState(updatedPharmacy?.id);
    const [state, setState] = useState(updatedPharmacy?.id);
    const [name, setName] = useState(updatedPharmacy?.name);
    const [address, setAddress] = useState(updatedPharmacy?.address);
    const [altitude, setAltitude] = useState(updatedPharmacy?.altitude);
    const [longitude, setLongitude] = useState(updatedPharmacy?.longitude);
    const [zoneId, setZoneId] = useState(updatedPharmacy?.zone.id);
    const [zoneName, setZoneName] = useState(updatedPharmacy?.zone.name);
    const [showMap, setShowMap] = useState(false);
    const [zones, setZones] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        setUpdatedPharmacy(pharmacy);
    }, [pharmacy]);

    useEffect(() => {
        const fetchZones = async () => {
            const result = await axios.get("/api/zones");
            setZones(result.data);
            console.log(result.data);
        }
        fetchZones();
    }, []);

    const handleSubmit =async(e) => {
        e.preventDefault();

        const pharmacy = {
            id : id, state:state,
            name: name, address: address, altitude: altitude, longitude: longitude, zone: {
                id: zoneId, name:zoneName
            }
        };

        setUpdatedPharmacy(pharmacy);
        try {
            console.log(pharmacy)
            const response = await axios.put(`/api/pharmacies/${updatedPharmacy.id}/update`, pharmacy);
            updatePharmacy(pharmacy);

        }catch (error){
            console.log(error);
            Notiflix.Notify.failure("Failed to update Pharmacy");
        }
        onHide();
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
                {showMap && <div><MapComponent onSelect={handleCoordsSelected} center={currentLocation}/></div>}
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateForm;
