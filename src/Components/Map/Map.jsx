import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../App.css";
import {Icon} from "leaflet/src/layer/marker";
import {Button, Card} from "react-bootstrap";


const MapComponent = ({ selectedPharmacy }) => {

    const customIcon = new Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/4287/4287703.png',
        iconSize: [38, 38],
    });

    const handlePhoneNumberClick = () => {
        window.location.href = `tel:${selectedPharmacy.phone}`;
    };

    const handleGetDirectionsClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const origin = `${latitude},${longitude}`;
                    const { altitude, longitude: destinationLongitude } = selectedPharmacy;
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

    return (
        <MapContainer style={{ height: '500px', width: '100%' }} center={[selectedPharmacy.altitude, selectedPharmacy.longitude]} zoom={16} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={customIcon} position={[selectedPharmacy.altitude, selectedPharmacy.longitude]}>
                <Popup>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>{selectedPharmacy.name}</Card.Title>
                            <Card.Text><strong>Address: </strong>{selectedPharmacy.address}</Card.Text>
                            <Card.Text>
                                <strong>Phone Number: </strong><a href={`tel:${selectedPharmacy.phone}`} onClick={handlePhoneNumberClick}>{selectedPharmacy.phone}</a>
                            </Card.Text>
                            <Button variant="primary" onClick={handleGetDirectionsClick}>
                                Get Directions
                            </Button>
                        </Card.Body>
                    </Card>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;