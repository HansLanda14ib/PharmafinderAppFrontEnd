import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import ConfirmationModal from "./ConfirmationModel";
import "../styles/custom-modal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus  } from '@fortawesome/free-solid-svg-icons';

import {toast} from 'react-toastify';
import MapComponent from "./MapComponent";


const toastOptions = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
};

export default function PharmacyList({zoneId}) {
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [showDiv, setShowDiv] = useState(false);
    const [zones, setZones] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deletemodalIsOpen, setDeletemodalIsOpen] = useState(false);
    const [editmodalIsOpen, setEditmodalIsOpen] = useState(false);
    const [deletedPharmacy, setDeletedPharmacy] = useState(null);
    const [editpharmacy, setEditpharmacy] = useState(null);

    const [currentLocation, setCurrentLocation] = useState(null);

    const pharmacyStates = {
        0: "WAITING", 1: "ACCEPTED", 2: "REJECTED",
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            setCurrentLocation([latitude, longitude]);
        }, (error) => {
            console.error(error);
        });
        const fetchPharmacies = async () => {
            const result = await axios.get("/api/pharmacies");
            setPharmacies(result.data);
            console.log(result.data);
        }
        fetchPharmacies();

        const fetchZones = async () => {
            const result = await axios.get("/api/zones");
            setZones(result.data);
            console.log(result.data);
        }
        fetchZones();

    }, []);

    const handleOpenModal = (pharmacy) => {
        console.log('Opening modal');
        setSelectedPharmacy(pharmacy);
        setModalIsOpen(true);
    };


    const handleCloseModal = () => {
        console.log('Closing modal');
        setSelectedPharmacy(null);
        setModalIsOpen(false);
    };

    const acceptPharmacy = async () => {
        try {
            const {status} = await axios.put(`api/pharmacies/acceptPharmacy/id=${selectedPharmacy.id}`);
            if (status === 200 || status === 201) {
                const updatedPharmacy = {...selectedPharmacy, state: 1};
                setPharmacies(prevPharmacies => prevPharmacies.map(pharmacy => pharmacy.id === updatedPharmacy.id ? updatedPharmacy : pharmacy));
                toast.info('Pharmacy accepted successfully', {...toastOptions});
            } else {
                toast.error("Failed to accept pharmacy");
            }
        } catch (error) {
            toast.error("Failed to accept pharmacy");
        } finally {
            handleCloseModal();
        }
    };

    const refusePharmacy = async () => {
        try {
            const response = await axios.put(`api/pharmacies/refusePharmacy/id=${selectedPharmacy.id}`);
            if (response.status === 200 || response.status === 201) {
                // Update the state with the new values
                const updatedPharmacy = {...selectedPharmacy, state: 2};
                setPharmacies(prevPharmacies => prevPharmacies.map(pharmacy => pharmacy.id === updatedPharmacy.id ? updatedPharmacy : pharmacy));

                toast.info('Pharmacy refused successfully', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                toast.error("Failed to refuse pharmacy");
            }
        } catch (error) {
            toast.error("Failed to refuse pharmacy");
        }
        handleCloseModal();
    };

    const deleteOpenModal = (pharmacyId) => {
        setDeletedPharmacy(pharmacyId);

        setDeletemodalIsOpen(true);
    };

    const editOpenModal = (pharmacy) => {
        setEditpharmacy(pharmacy);
        setEditmodalIsOpen(true);
    };
    const editCloseModal = () => {
        setEditpharmacy(null);
        setEditmodalIsOpen(false);
    };

    const handleDelete = useCallback(async () => {
        try {
            const response = await axios.delete(`/api/pharmacies/deletePharmacy/id=${deletedPharmacy}`);

            if (response.status === 200 || response.status === 204) {
                setPharmacies(pharmacies.filter((pharmacy) => pharmacy.id !== deletedPharmacy));
                toast.success("Pharmacy deleted successfully");
            } else {
                toast.error("Failed to delete Pharmacy");
            }
        } catch (error) {
            toast.error("Failed to delete Pharmacy");
        }

        // Close the modal and reset the zoneIdToDelete state
        setDeletemodalIsOpen(false);
        setDeletedPharmacy(null);
    }, [deletedPharmacy, pharmacies]);


    const handleUpdate = useCallback(async () => {
        try {
            const response = await axios.put(`/api/pharmacies/updatePharmacy/id=${editpharmacy.id}`, editpharmacy);

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
                toast.info("Pharmacy has been updated");
            } else {
                toast.error("Failed to update Pharmacy");
            }
        } catch (error) {
            toast.error("Failed to update Pharmacy");
        }
    }, [editpharmacy, pharmacies]);


    const handleClick = () => {
        setShowDiv(true);
    };
    const handleCoordsSelected = (coords) => {

        setEditpharmacy({...editpharmacy, altitude: coords[0], longitude: coords[1]});


    };
    return (
        <div className="pharmacies-container">
                <h1>Pharmacies</h1>
                <Link to={`/add-pharmacy`} className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} />
                   <span>Add Pharmacy</span>
                </Link>
                <Link to={`/map`} className="btn btn-info">
                    Pharmacies on Map
                </Link>
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Altitude</th>
                        <th>Longitude</th>
                        <th>State</th>
                        <th>Zone</th>

                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pharmacies.map((pharmacy) => (<tr key={pharmacy.id}>
                        <td>{pharmacy.id}</td>
                        <td>{pharmacy.name}</td>
                        <td>{pharmacy.address}</td>
                        <td>{pharmacy.altitude}</td>
                        <td>{pharmacy.longitude}</td>
                        <td>
                            <button
                                className={pharmacy.state === 0 ? "btn btn-warning" : pharmacy.state === 1 ? "btn btn-success" : pharmacy.state === 2 ? "btn btn-danger" : "inherit"}
                                onClick={() => handleOpenModal(pharmacy)}>
                                {pharmacyStates[pharmacy.state]}</button>
                        </td>

                        <td>{pharmacy.zone && pharmacy.zone.name}
                        </td>

                        <td>
                            <button className="btn btn-danger" onClick={() => deleteOpenModal(pharmacy.id)}>
                                Delete
                            </button>
                            <button className="btn btn-primary" onClick={() => editOpenModal(pharmacy)}>
                                Edit
                            </button>
                        </td>
                    </tr>))}
                    </tbody>
                </table>
                <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} className="custom-modal2">

                    {/*  <button className="btn btn-success" onClick={acceptPharmacy}>
                    Accept
                </button>
                <button className="btn btn-danger" onClick={refusePharmacy}>
                    Refuse
                </button>
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                    Abort
                </button> */}
                    {selectedPharmacy && selectedPharmacy.state === 0 && (<>
                        <button
                            className="btn btn-success"
                            onClick={() => handleOpenModal(acceptPharmacy)}
                        >
                            Accept
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleOpenModal(refusePharmacy)}
                        >
                            Refuse
                        </button>
                    </>)}

                    {selectedPharmacy && (selectedPharmacy.state === 1 || selectedPharmacy.state === 2) && (<button
                        className={selectedPharmacy.state === 2 ? "btn btn-success" : selectedPharmacy.state === 1 ? "btn btn-danger" : ""}
                        onClick={() => {
                            if (selectedPharmacy.state === 1) {
                                handleOpenModal(refusePharmacy);
                            } else if (selectedPharmacy.state === 2) {
                                handleOpenModal(acceptPharmacy);
                            }
                        }}
                    >

                        {selectedPharmacy.state === 1 ? "Refuse" : selectedPharmacy.state === 2 ? "Accept" : ""}
                    </button>)}

                </Modal>

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
                <ConfirmationModal
                    isOpen={deletemodalIsOpen}
                    onRequestClose={() => setDeletemodalIsOpen(false)}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletemodalIsOpen(false)}
                    message="Are you sure you want to delete this pharmacy?"
                />

            </div>

    )

}