import Modal from "react-modal";
import MapComponent from "../Map/MapComponent";
import React, {useCallback, useState} from "react";
import axios from "axios";
import Notiflix from "notiflix";

<Modal isOpen={editmodalIsOpen} onRequestClose={editCloseModal} className="custom-modal">
    <h3>Update your pharmacy info:</h3>
    <ul>
        <li>
            <label>Nom</label>
            <input type="text" value={editpharmacy && editpharmacy.name}
                   onChange={(e) => setEditpharmacy({...editpharmacy, name: e.target.value})}/>
        </li>

        <li>
            <label>Address</label>
            <input type="text" value={editpharmacy && editpharmacy.address}
                   onChange={(e) => setEditpharmacy({...editpharmacy, address: e.target.value})}/>
        </li>
        <li>
            <label>Zone</label>
            <select value={editpharmacy && editpharmacy.zone && editpharmacy.zone.id}
                    onChange={(e) => setEditpharmacy({...editpharmacy, zone: {id: e.target.value}})}>
                {zones.map((zone) => (<option key={zone.id} value={zone.id}>
                    {zone.name}
                </option>))}
            </select>
        </li>
        <li>
            <label htmlFor="laltitude">Latitude:</label>
            <input type="number" id="laltitude" name="laltitude"
                   value={editpharmacy && editpharmacy.altitude} disabled required/>
        </li>
        <li>
            <label htmlFor="longitude">Latitude:</label>
            <input type="number" id="longitude" name="longitude"
                   value={editpharmacy && editpharmacy.longitude} disabled required/>
        </li>
        <li>
            <button onClick={handleClick}>Get my position</button>
            {showDiv &&
                <div><MapComponent onSelect={handleCoordsSelected} center={currentLocation}/></div>}
        </li>
        <li>
            <button onClick={handleUpdate}>Update Pharmacy</button>

        </li>
    </ul>

</Modal>

const handleCoordsSelected = (coords) => {

    setEditpharmacy({...editpharmacy, altitude: coords[0], longitude: coords[1]});


};
const handleUpdatePharmacy = (updatedPharmacy) => {
    // filter the deleted pharmacys
    setPharmacies([...pharmacies, updatedPharmacy]);
};

const handleClick = () => {
    setShowDiv(true);
};
const handleUpdate = useCallback(async () => {
    try {
        const response = await axios.put(`/api/pharmacies/${editpharmacy.id}/update`, editpharmacy);

        if (response.status === 200 || response.status === 204) {
            const updatedPharmacies = pharmacies.map((pharmacy) => {
                if (pharmacy.id === editpharmacy.id) {
                    return {
                        ...pharmacy,
                        name: editpharmacy.name,
                        address: editpharmacy.address,
                        zone: {id: editpharmacy.zone.id},
                        altitude: editpharmacy.altitude,
                        longitude: editpharmacy.longitude,
                        state: editpharmacy.state,
                    };
                }
                return pharmacy;
            });

            setPharmacies(updatedPharmacies);

            setEditmodalIsOpen(false);
            Notiflix.Notify.info("Pharmacy has been updated");
        } else {
            Notiflix.Notify.failure("Failed to update Pharmacy");
        }
    } catch (error) {
        Notiflix.Notify.failure("Failed to update Pharmacy");
    }
}, [editpharmacy, pharmacies]);

const editOpenModal = (pharmacy) => {
    setEditpharmacy(pharmacy);
    setEditmodalIsOpen(true);

};
const editCloseModal = () => {
    setEditpharmacy(null);
    setEditmodalIsOpen(false);
};
const [editmodalIsOpen, setEditmodalIsOpen] = useState(false);
const [editpharmacy, setEditpharmacy] = useState(null);
const [showDiv, setShowDiv] = useState(false);