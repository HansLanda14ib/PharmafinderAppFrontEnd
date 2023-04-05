import React, {useState, useEffect} from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css'
import {toast} from 'react-toastify';
import {useNavigate} from "react-router-dom";

import MapComponent from "./MapComponent";


const PharmacyForm = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [altitude, setAltitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [zoneId, setZoneId] = useState("");
    const [cityId, setCityId] = useState("");
    const [zones, setZones] = useState([]);
    const [cities, setCities] = useState([]);
    const [showDiv, setShowDiv] = useState(false);
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState(null);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                setCurrentLocation([latitude, longitude]);
            },
            (error) => {
                console.error(error);
            }
        );
    }, []);
    const handleCoordsSelected = (coords) => {
        setAltitude(coords[0]);
        setLongitude(coords[1]);
    };
    useEffect(() => {
        axios.get(`/api/zones/zone/city=${cityId}`).then((response) => {
            setZones(response.data);
        });
    }, [cityId]);
    useEffect(() => {
        axios.get("/api/cities").then((response) => {
            setCities(response.data);
        });
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !address || !zoneId) {
            toast.error("Name and address and zone are required");
            return;
        }


        const pharmacy = {
            name: name,
            address: address,
            altitude: altitude,
            longitude: longitude,
            zone: {
                id: zoneId,
            }
        };

        try {

            const response = await axios.post("/api/pharmacies/save", pharmacy);
            if (response.status === 200 || response.status === 204) {

                toast.success("Pharmacy added successfully");
                navigate("/pharmacies");
            }
            console.log(response.data);


        } catch (error) {
            console.log(error);
            toast.error("Pharmacy problem");
            // Handle the error
        }

    };
    const handleClick = () => {
        setShowDiv(true);
    };
    return (
        <>

            <form onSubmit={handleSubmit}>
                <div className="form-group">

                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cityId">City:</label>
                    <select
                        className="form-control"
                        id="cityId"
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                    >
                        <option value="">Select a city</option>
                        {cities && cities.map((city) => (<option key={city.id} value={city.id}>
                            {city.name}
                        </option>))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="zoneId">Zone:</label>
                    <select
                        className="form-control"
                        id="zoneId"
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                    >
                        <option value="">Select a zone</option>
                        {zones && zones.map((zone) => (<option key={zone.id} value={zone.id}>
                            {zone.name}
                        </option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="altitude">Latitude:</label>
                    <input type="number" id="altitude" name="altitude" value={altitude} disabled required/>
                </div>
                <div>
                    <label htmlFor="longitude">Longitude:</label>
                    <input type="number" id="longitude" name="longitude" value={longitude} disabled required/>
                </div>
                <button type="submit" className="btn btn-primary">
                    Add
                </button>


            </form>

            <button onClick={handleClick}>Get my position</button>
            {showDiv && <div><MapComponent onSelect={handleCoordsSelected} center={currentLocation}/></div>}

            </>);
            };

            export default PharmacyForm;