import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css"
import "../App.css";
import {Icon} from "leaflet/src/layer/marker";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, {useEffect, useState} from 'react';
import axios from "axios";

const MapComponent = () => {
   // const [coords, setCoords] = useState([]);
    const position = [31.611530277838078, -8.047648552164675];
    const [currentLocation, setCurrentLocation] = useState(null);
    const [markers, setMarkers] = useState([]);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => { //dont change this
                const {latitude, longitude} = position.coords;
                setCurrentLocation([latitude, longitude]);
            },
            (error) => {
                console.error(error);
            }
        );
    }, []);

    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const response = await axios.get("/api/pharmacies");
                const markers = response.data.map((pharmacy) => ({
                    geocode: [pharmacy.altitude, pharmacy.longitude],
                    pharmacy: pharmacy
                }));
                setMarkers(markers);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPharmacies();
    }, []);
    const customIcon = new Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/4287/4287703.png',
            iconSize: [38, 38]
        }
    );
    const userIcon = new Icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3382/3382279.png',
            iconSize: [50, 50]
        }
    );


    const MyPopup = ({ pharmacy }) => {
        return (
            <Popup>
                <h3>{pharmacy.name}</h3>
                <p>{pharmacy.address}</p>

            </Popup>
        );
    };

    // eslint-disable-next-line no-undef
    const map = React.useRef(null);
    return (
        <div className="home-container">
            <h1>Welcome to Pharma Finder</h1>
            <p>Find pharmacies near you, anytime.</p>
            <MapContainer style={{ height: "600px", width: "1400px" }} center={position} zoom={8} scrollWheelZoom={true} ref={map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                    {markers.map(marker => (<Marker icon={customIcon} position={marker.geocode}>
                            <MyPopup pharmacy={marker.pharmacy} />
                        </Marker>
                    ))}
                </MarkerClusterGroup>
                {currentLocation && (
                    <Marker icon={userIcon} position={currentLocation}>
                        <Popup><h6> You are here </h6></Popup>
                    </Marker>
                )}

            </MapContainer>

        </div>


    );

};


export default MapComponent;
