import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Modal from "react-modal";

export default function ZoneList({cityId}) {
    const [zones, setZones] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [cities, setCities] = useState([]);

    useEffect(() => {

        const fetchZones = async () => {
            const result = await axios.get("http://localhost:8080/api/zones");
            setZones(result.data);
            console.log(result.data);
        }
        fetchZones();

    }, [cityId]);

    useEffect(() => {
        const fetchCities = async () => {
            const result = await axios.get("http://localhost:8080/api/cities");
            setCities(result.data);
        };
        fetchCities();
    }, []);

    const handleDelete = (zoneId) => {
        if (window.confirm("Are you sure you want to delete this zone?")) {
            axios.delete(`http://localhost:8080/api/zones/deleteZone/id=${zoneId}`).then(() => {
                setZones(zones.filter((zone) => zone.id !== zoneId));
            });
        }
    };

    const handleOpenModal = (zone) => {
        setSelectedZone(zone);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedZone(null);
        setModalIsOpen(false);
    };

    const handleSave = () => {
        // TODO: handle save logic
        handleCloseModal();
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
                {zones.map((zone) => (
                    <tr key={zone.id}>
                        <td>{zone.id}</td>
                        <td>{zone.nom}</td>
                        <td>{zone.ville && zone.ville.nom}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDelete(zone.id)}>
                                Delete
                            </button>
                            <button className="btn btn-primary" onClick={() => handleOpenModal(zone)}>
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
                <h3>Modification de la zone</h3>
                <ul>
                    <li>
                        <label>Nom de la zone:</label>
                        <input type="text" value={selectedZone && selectedZone.nom}/>
                    </li>
                    <li>
                        <label>Ville:</label>
                        <select value={selectedZone && selectedZone.ville && selectedZone.ville.id}>
                            {cities.map((ville) => (
                                <option key={ville.id} value={ville.id}>
                                    {ville.nom}
                                </option>
                            ))}
                        </select>
                    </li>
                </ul>
                <button className="btn btn-primary" onClick={handleCloseModal}>
                    Annuler
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                    Sauvegarder
                </button>
            </Modal>

        </div>
    );
};


