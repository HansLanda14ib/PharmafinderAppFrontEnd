import {MapContainer, Marker, Popup, TileLayer, Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../App.css";
import {Icon} from "leaflet/src/layer/marker";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";
import {Button, Card} from "react-bootstrap";
import authHeader from "../../Services/auth-header";
import AuthService from "../../Services/auth.service";
import handlePhoneNumberClick from './Map'
import apiUrl from "../../config";

const mypharmacies=[
    {
        "id": 1,
        "name": "manar pharmacy",
        "address": "a marrakech hivernage",
        "phone": "0688033778",
        "altitude": 31.621228395415503,
        "longitude": -8.027744293212892,
        "state": 1,
        "zone": {
            "id": 1,
            "name": "Hivernage",
            "city": {
                "id": 1,
                "name": "Marrakech"
            }
        }
    },
    {
        "id": 2,
        "name": "labase pharmacy",
        "address": "targa",
        "phone": "0524033787",
        "altitude": 31.651262566610033,
        "longitude": -8.058128356933596,
        "state": 1,
        "zone": {
            "id": 2,
            "name": "Sidi ghanem",
            "city": {
                "id": 1,
                "name": "Marrakech"
            }
        }
    },
    {
        "id": 4,
        "name": "talbourjt pharmacy",
        "address": "a talbourjt agadir",
        "phone": "0688093778",
        "altitude": 30.412632322494165,
        "longitude": -9.566345214843752,
        "state": 1,
        "zone": {
            "id": 12,
            "name": "Talbourjt",
            "city": {
                "id": 6,
                "name": "Agadir"
            }
        }
    },
    {
        "id": 5,
        "name": "pharmacy taddart",
        "address": "a taddart agadir",
        "phone": "0688037896",
        "altitude": 30.46472888494151,
        "longitude": -9.549865722656252,
        "state": 2,
        "zone": {
            "id": 13,
            "name": "Taddart",
            "city": {
                "id": 6,
                "name": "Agadir"
            }
        }
    },
    {
        "id": 6,
        "name": "pharmacy agdal",
        "address": "au agdal rabat",
        "phone": "0688037896",
        "altitude": 34.03078943899101,
        "longitude": -6.826629638671876,
        "state": 2,
        "zone": {
            "id": 8,
            "name": "Agadal",
            "city": {
                "id": 3,
                "name": "Rabat"
            }
        }
    },
    {
        "id": 7,
        "name": "pharmacy ainchok",
        "address": "a Ain chock Casa",
        "phone": "0688037896",
        "altitude": 33.56328275381754,
        "longitude": -7.597045898437501,
        "state": 1,
        "zone": {
            "id": 11,
            "name": "Ainchok",
            "city": {
                "id": 2,
                "name": "Casablanca"
            }
        }
    },
    {
        "id": 8,
        "name": "pharmacy medina ",
        "address": "a medina marrakech ",
        "phone": "0688037809",
        "altitude": 31.644150729333415,
        "longitude": -7.9737424859195025,
        "state": 1,
        "zone": {
            "id": 9,
            "name": "Medina",
            "city": {
                "id": 1,
                "name": "Marrakech"
            }
        }
    },
    {
        "id": 9,
        "name": "pharmacy sidi ghanem",
        "address": "a sidi ghanem marrakech",
        "phone": "0688037896",
        "altitude": 31.66763660225885,
        "longitude": -8.03203582763672,
        "state": 1,
        "zone": {
            "id": 2,
            "name": "Sidi ghanem",
            "city": {
                "id": 1,
                "name": "Marrakech"
            }
        }
    }
]

const MapComponent = () => {
    const position = [31.611530277838078, -8.047648552164675];
    const [currentLocation, setCurrentLocation] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [pharmacies, setPharmacies] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState({});
    const [popupVisible, setPopupVisible] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [polylineCoords, setPolylineCoords] = useState(null); // Added state for polyline coordinates
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);

        }

    }, []);
    const fetchPharmacies = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/pharmacies`, {headers: authHeader()})
            //setPharmacies(response.data);
            setPharmacies(mypharmacies);
            const markers = mypharmacies.map((pharmacy) => ({
                geocode: [pharmacy.altitude, pharmacy.longitude],
                pharmacy: pharmacy,
            }));
            setMarkers(markers);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const options = {
            enableHighAccuracy: true, // Use GPS and other high-accuracy methods
            timeout: 5000, // Wait up to 5 seconds for a location
            maximumAge: 0, // Force the browser to get a fresh location (no caching)
        };
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                setCurrentLocation([latitude, longitude]);
            },
            (error) => {
                console.error(error);
            }, options
        );
    }, []);

    useEffect(() => {
        fetchPharmacies();
    }, [fetchPharmacies]);

    const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/4287/4287703.png",
        iconSize: [38, 38],
    });

    const userIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3382/3382279.png",
        iconSize: [50, 50],
    });

    const handleMarkerClick = useCallback((pharmacy) => {
        setSelectedPharmacy(pharmacy);
        setPopupVisible(true);
    }, []);


    const handleGetDirectionsClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    const origin = `${latitude},${longitude}`;
                    const {altitude, longitude: destinationLongitude} = selectedPharmacy;
                    const destination = `${altitude},${destinationLongitude}`;
                    const mapsURL = `https://www.google.com/maps/dir/${origin}/${destination}`;
                    window.open(mapsURL);
                },
                (error) => {
                    console.error("Error getting current position:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const MyPopup = ({pharmacy, visible, onClose}) => {
        return (<>
            {pharmacy && visible && (
                <Popup onClose={onClose}>
                    <Card>
                        <Card.Body className="text-left">
                            <Card.Title><strong>{pharmacy.name}</strong></Card.Title>
                            <br/>
                            <Card.Subtitle><strong>Address: </strong>{pharmacy.address}</Card.Subtitle>
                            <br/>
                            <Card.Subtitle><strong>Zone: </strong>{pharmacy.zone.name}</Card.Subtitle>
                            <br/>
                            <Card.Subtitle>
                                <strong>Phone Number: </strong><a href={`tel:${pharmacy.phone}`}
                                                                  onClick={handlePhoneNumberClick}>{pharmacy.phone}</a>
                            </Card.Subtitle>
                            <br/>
                            {currentUser?.role === 'ADMIN' &&
                                <>
                                    <Card.Subtitle> <strong>State: </strong>
                                        {pharmacy.state === 0 && <span>Waiting</span>}
                                        {pharmacy.state === 1 && <span>Accepted</span>}
                                        {pharmacy.state === 2 && <span>Refused</span>}
                                    </Card.Subtitle>

                                </>
                            }
                            <br/>
                            <Button variant="primary" onClick={handleGetDirectionsClick}>
                                Get Directions
                            </Button>
                        </Card.Body>
                    </Card>
                </Popup>)}
        </>);
    };


    return (
        <div className="pharmacies-container">
            <h2>Welcome to Pharma Finder</h2>
            <p>Find pharmacies near you, anytime.</p>
<div style={{ justifyContent: "center",display: "flex"}}>
    <MapContainer
        style={{height: "600px", width: "1000px"}}
        center={position}
        zoom={13}
        scrollWheelZoom={true}
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
            {markers.map((marker) => (<Marker
                key={marker.pharmacy.id}
                icon={customIcon}
                position={marker.geocode}
                eventHandlers={{
                    click: () => handleMarkerClick(marker.pharmacy),
                }}
            >
                {selectedPharmacy && (<MyPopup
                    pharmacy={selectedPharmacy}
                    visible={popupVisible}
                    onClose={() => setPopupVisible(false)

                    }
                />)}
            </Marker>))}
        </MarkerClusterGroup>
        {currentLocation && (<Marker icon={userIcon} position={currentLocation}>
            <Popup>
                <h6> You are here </h6>
            </Popup>
        </Marker>)}
        {polylineCoords &&
            <Polyline positions={polylineCoords} color="red"/>} {/* Display the polyline */}
    </MapContainer>
</div>

        </div>
    );

}
export default MapComponent;