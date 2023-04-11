import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../App.css";
import {Icon} from "leaflet/src/layer/marker";
import MarkerClusterGroup from "react-leaflet-cluster";
import React, {useEffect, useState, useCallback} from "react";
import axios from "axios";
import {Form} from "react-bootstrap";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Confirm} from "notiflix/build/notiflix-confirm-aio";
import Notiflix from "notiflix";


const MapComponent = () => {
    const position = [31.611530277838078, -8.047648552164675];
    const [currentLocation, setCurrentLocation] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [pharmacies, setPharmacies] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState({});
    const [popupVisible, setPopupVisible] = useState(false);

    const fetchPharmacies = useCallback(async () => {
        try {
            const response = await axios.get("/api/pharmacies");
            setPharmacies(response.data);
            const markers = response.data.map((pharmacy) => ({
                geocode: [pharmacy.altitude, pharmacy.longitude],
                pharmacy: pharmacy,
            }));
            setMarkers(markers);
        } catch (error) {
            console.error(error);
        }
    }, []);

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

    const handleDelete = async (pharmacyId) => {
        Confirm.show(
            "Delete Confirm",
            "Are you sure you want to delete?",
            "Delete",
            "Cancel",
            async () => {
                try {
                    const response = await axios.delete(
                        `/api/pharmacies/deletePharmacy/id=${pharmacyId}`
                    );
                    if (response.status === 200 || response.status === 204) {
                        setPharmacies((prevPharmacies) =>
                            prevPharmacies.filter(
                                (pharmacy) => pharmacy.id !== pharmacyId
                            )
                        );
                        setMarkers((prevMarkers) =>
                            prevMarkers.filter(
                                (marker) => marker.pharmacy.id !== pharmacyId
                            )
                        );
                        Notiflix.Notify.success("Pharmacy deleted successfully");
                    } else {
                        Notiflix.Notify.failure("Failed to delete Pharmacy");
                    }
                } catch (error) {
                    Notiflix.Notify.failure("Failed to delete Pharmacy");
                }
            },
            () => {
                console.log("Cancel");
            }
        );
    };

    const handleMarkerClick = useCallback((pharmacy) => {
        setSelectedPharmacy(pharmacy);
        setPopupVisible(true);
    }, []);

    const MyPopup = ({pharmacy, visible, onClose}) => {
        return (<>
            {pharmacy && visible && (<Popup onClose={onClose}>
                <Form>
                    <Form.Label style={{fontWeight: "bold"}}>Name:</Form.Label>
                    {pharmacy.name}
                    <br/>
                    <Form.Label style={{fontWeight: "bold"}}>Address:</Form.Label>
                    {pharmacy.address}
                    <br/>
                    <Form.Label style={{fontWeight: "bold"}}>State:</Form.Label>
                    {pharmacy.state === 0 && <span>Waiting</span>}
                    {pharmacy.state === 1 && <span>Accepted</span>}
                    {pharmacy.state === 2 && <span>Refused</span>}
                    <br/>
                    <Form.Label style={{fontWeight: "bold"}}>Zone:</Form.Label>
                    {pharmacy.zone.name}
                    <br/>
                    <Form.Label style={{fontWeight: "bold"}}>Location:</Form.Label>
                    [{pharmacy.altitude.toFixed(3)}, {pharmacy.longitude.toFixed(3)}]
                    <br/>
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="text-danger cursor"
                        onClick={() => handleDelete(pharmacy.id)}
                    />
                </Form>
            </Popup>)}
        </>);
    };

    return (
        <>
            <div className="home-container">
                <h1>Welcome to Pharma Finder</h1>
                <p>Find pharmacies near you, anytime.</p>
                <MapContainer
                    style={{height: "600px", width: "1400px"}}
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
                                onClose={() => setPopupVisible(false)}
                            />)}
                        </Marker>))}
                    </MarkerClusterGroup>
                    {currentLocation && (<Marker icon={userIcon} position={currentLocation}>
                        <Popup>
                            <h6> You are here </h6>
                        </Popup>
                    </Marker>)}
                </MapContainer>
            </div>
        </>
    )
        ;

}
export default MapComponent;