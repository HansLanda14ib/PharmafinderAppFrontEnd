import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../App.css";
import {Icon} from "leaflet/src/layer/marker";


const MapComponent = ({selectedPharmacy }) => {

    const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/4287/4287703.png",
        iconSize: [38, 38],
    });



    return (



        <MapContainer style={{ height: "500px", width: "1100px" }} center={[selectedPharmacy.altitude, selectedPharmacy.longitude] } zoom={16} scrollWheelZoom={true} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={customIcon} position={[selectedPharmacy.altitude, selectedPharmacy.longitude]}>
                <Popup>
                    Pharmacy: {selectedPharmacy.name} <br /> Address: {selectedPharmacy.address}
                </Popup></Marker>
        </MapContainer>



    );
};

export default MapComponent;
