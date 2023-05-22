import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {Button, Container, FormControl, FormGroup} from 'react-bootstrap';
import AuthService from '../../Services/auth.service';
import axios from 'axios';
import authHeader from '../../Services/auth-header';
import MapComponent from "../Map/MapComponent";
import Notiflix from "notiflix";

function CreatePharmacy() {
    // eslint-disable-next-line no-unused-vars
    const [pharmacy, setPharmacy] = useState([]);
    const [id, setId] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [altitude, setAltitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [zoneId, setZoneId] = useState('');
    const [zones, setZones] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [zoneName, setZoneName] = useState();
    useEffect(() => {
        const fetchPharmacyData = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user) {
                    const response = await axios.get(`http://localhost:8080/api/v1/pharmacies/user/${user.email}`, {headers: authHeader()});
                    setPharmacy(response.data);
                    setId(response.data?.id ?? null);
                    setName(response.data?.name ?? '');
                    setPhone(response.data?.phone ?? '');
                    setAddress(response.data?.address ?? '');
                    setAltitude(response.data?.altitude ?? '');
                    setLongitude(response.data?.longitude ?? '');
                    setZoneId(response.data?.zone?.id ?? '');
                    setZoneName(response.data?.zone?.name ?? '');
                }
            } catch (error) {
                // Handle error gracefully
                console.error(error);
            }
        };

        fetchPharmacyData();
    }, []);
    useEffect(() => {
        const fetchZones = async () => {
            const result = await axios.get("http://localhost:8080/api/v1/zones", {headers: authHeader()})
            setZones(result.data);

        }
        fetchZones();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const pharmacy = {
            id: id, name: name, address: address, phone:phone,altitude: altitude, longitude: longitude, zone: {
                id: zoneId, name: zoneName
            }
        };

        try {
            if (!pharmacy.id) {
                const response = await axios.post("http://localhost:8080/api/v1/pharmacies/save", pharmacy, {headers: authHeader()})
                Notiflix.Notify.success("Pharmacy has been updated");
            } else {
                console.log(pharmacy.id)
                const response = await axios.put(`http://localhost:8080/api/v1/pharmacies/${pharmacy.id}/update`, pharmacy, {headers: authHeader()});
                Notiflix.Notify.success("Pharmacy has been updated");

            }


        } catch (error) {
            console.log(error.response.data);
            Notiflix.Notify.failure("Failed to update Pharmacy");
        }

    };
    const handleCoordsSelected = (coords) => {
        setAltitude(coords[0]);
        setLongitude(coords[1]);
    };
    const handleShowMapChange = (e) => {
        setShowMap(e.target.checked);
    };
    return (<Container className="col-xl-5 col-lg-5 col-md-5 col-xl-9 col-10 mt-5 p-4 border rounded shadow">
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
                <FormControl type="phone" placeholder="" value={phone} required
                             onChange={(e) => setPhone(e.target.value)}/>

            </FormGroup>
            <FormGroup>
                <Form.Label>Altitude</Form.Label>
                <FormControl type="altitude" placeholder="" value={altitude} required disabled/>
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
            {showMap && <div><MapComponent onSelect={handleCoordsSelected}/></div>}
            <Button type="submit" variant="primary" onClick={handleSubmit}>
                Save Changes
            </Button>
        </Form>
    </Container>);
}

export default CreatePharmacy;
