import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import ConfirmationModal from "./ConfirmationModel";
import "../styles/custom-modal.css";
import Notiflix from 'notiflix';
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
                Notiflix.Notify.success('Zone deleted successfully');

            } else {
                Notiflix.Notify.warning('Failed to delete zone');

            }
        } catch (error) {
            Notiflix.Notify.failure('Failed to delete zone');

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
        const data = new URLSearchParams();
        data.append('name', selectedZone.name);
        data.append('cityId', selectedZone.city.id);

        try {
            const response = await axios.put(`/api/zones/${selectedZone.id}?${data}`);

            if (response.status === 200 || response.status === 204) {
                // Update the state with the updated data received from the API
                setZones(zones.map((zone) => {
                    if (zone.id === selectedZone.id) {
                        return {
                            ...zone,
                            name: selectedZone.name,
                            city: selectedZone.city,
                        };
                    }
                    return zone;
                }));
                Notiflix.Notify.info('Zone has been updated');

                setModalIsOpen(false);
            } else {
                Notiflix.Notify.failure("Failed to update zone");

            }
        } catch (error) {
            Notiflix.Notify.failure("Failed to update zone");
        }
    };


    return (

        <div>

            <h2>Zones</h2>
            <Link to={`/add-zone`} className="btn btn-primary">
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
                    <td>{zone.name}</td>
                    <td>{zone.city && zone.city.name}</td>
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
            <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} className="custom-modal">
                <h3>Modification de la zone</h3>
                <ul>
                    <li>
                        <label>Name</label>
                        <input type="text" value={selectedZone && selectedZone.name}
                               onChange={(e) => setSelectedZone({...selectedZone, name: e.target.value})}/>
                    </li>
                    <li>
                        <label>City</label>
                        <select value={selectedZone && selectedZone.city && selectedZone.city.id}
                                onChange={(e) => setSelectedZone({...selectedZone, city: {id: e.target.value}})}>
                            {cities.map((city) => (<option key={city.id} value={city.id}>
                                {city.name}
                            </option>))}
                        </select>
                    </li>
                </ul>
                <ul>

                        <button onClick={handleCloseModal}>
                            Abort
                        </button>

                        <button onClick={handleSave}>
                            Save
                        </button>

                </ul>
            </Modal>

            {/* <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"/> */}
            <ConfirmationModal
                isOpen={isModalOpen2}
                onRequestClose={() => setIsModalOpen2(false)}
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen2(false)}
                message="Are you sure you want to delete this item?"
            />
        </div>);
};


