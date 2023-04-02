import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import {ToastContainer, toast} from 'react-toastify';
import ConfirmationModal from "./ConfirmationModel";

export default function ZoneList({cityId}) {
    const [zones, setZones] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [cities, setCities] = useState([]);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [zoneIdToDelete, setZoneIdToDelete] = useState(null);

    useEffect(() => {

        const fetchZones = async () => {
            const result = await axios.get("/api/zones");
            setZones(result.data);
            console.log(result.data);
        }
        fetchZones();

    }, [cityId]);

    useEffect(() => {
        const fetchCities = async () => {
            const result = await axios.get("/api/cities");
            setCities(result.data);
        };
        fetchCities();
    }, []);

    const deleteOpenModal = (zoneId) => {
        setZoneIdToDelete(zoneId);
        setIsModalOpen2(true);
    };
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/zones/deleteZone/id=${zoneIdToDelete}`);

            if (response.status === 200 || response.status === 204) {
                setZones(zones.filter((zone) => zone.id !== zoneIdToDelete));
                toast.success("Zone deleted successfully");
            } else {
                toast.error("Failed to delete zone");
            }
        } catch (error) {
            toast.error("Failed to delete zone");
        }

        // Close the modal and reset the zoneIdToDelete state
        setIsModalOpen2(false);
        setZoneIdToDelete(null);
    };


    const handleOpenModal = (zone) => {
        setSelectedZone(zone);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedZone(null);
        setModalIsOpen(false);
    };

    const handleSave = async () => {
        console.log('selectedZone before API request', selectedZone); // add this line to check the value of selectedZone before making the API request
        const data = new URLSearchParams();
        data.append('nom', selectedZone.nom);
        data.append('ville_Id', selectedZone.ville.id);
        try {
            const response = await axios.put(`/api/zones/${selectedZone.id}?${data}`);
            console.log('API response', response); // add this line to check the response from the API
        } catch (error) {
            console.log('API error', error); // add this line to check the error returned by the API
        }
    };


    return (

        <div>

            <h2>Zones</h2>
            <Link to={`/create-zone`} className="btn btn-primary">
                Add Zone
            </Link>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {zones.map((zone) => (<tr key={zone.id}>
                    <td>{zone.id}</td>
                    <td>{zone.nom}</td>
                    <td>{zone.ville && zone.ville.nom}</td>
                    <td>
                        <button className="btn btn-danger" onClick={() => deleteOpenModal(zone.id)}>
                            Delete
                        </button>
                        <button className="btn btn-primary" onClick={() => handleOpenModal(zone)}>
                            Edit
                        </button>
                    </td>
                </tr>))}
                </tbody>
            </table>
            <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
                <h3>Modification de la zone</h3>
                <ul>
                    <li>
                        <label>Nom de la zone:</label>
                        <input type="text" value={selectedZone && selectedZone.nom}
                               onChange={(e) => setSelectedZone({...selectedZone, nom: e.target.value})}/>
                    </li>
                    <li>
                        <label>Ville:</label>
                        <select value={selectedZone && selectedZone.ville && selectedZone.ville.id}
                                onChange={(e) => setSelectedZone({...selectedZone, ville: {id: e.target.value}})}>
                            {cities.map((city) => (<option key={city.id} value={city.id}>
                                {city.nom}
                            </option>))}
                        </select>
                    </li>
                </ul>
                <button className="btn btn-primary" onClick={handleCloseModal}>
                    Abort
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                    Save
                </button>
            </Modal>

            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"/>
            <ConfirmationModal
                isOpen={isModalOpen2}
                onRequestClose={() => setIsModalOpen2(false)}
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen2(false)}
                message="Are you sure you want to delete this item?"
            />
        </div>);
};


