import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import "../styles/custom-modal.css";
import Notiflix from 'notiflix';
import {Confirm} from 'notiflix/build/notiflix-confirm-aio';
import FormCreate from "./FormCreate";
import UpdateForm from "./UpdateForm";
import {DropdownButton} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import Map from "./Map";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash} from "@fortawesome/free-solid-svg-icons";

export default function PharmacyList({zoneId}) {
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [editedPharmacy, setEditedPharmacy] = useState(null);
    const [zones, setZones] = useState([]);
    const [mapModalIsOpen, setMapModalIsOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const pharmacyStates = {0: "WAITING", 1: "ACCEPTED", 2: "REJECTED",};
    const [alt, setAlt] = useState('');
    const [long, setLong] = useState('');
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            setCurrentLocation([latitude, longitude]);
        }, (error) => {

        });
        const fetchPharmacies = async () => {
            const result = await axios.get("/api/pharmacies");
            setPharmacies(result.data);

        }
        fetchPharmacies();

        const fetchZones = async () => {
            const result = await axios.get("/api/zones");
            setZones(result.data);

        }
        fetchZones();

    }, []);

    const handleDelete = async (pharmacyId) => {

        Confirm.show(
            'Delete Confirm',
            'Are you you want to delete?',
            'Delete',
            'Abort',
            async () => {
                try {
                    const response = await axios.delete(`/api/pharmacies/deletePharmacy/id=${pharmacyId}`);

                    if (response.status === 200 || response.status === 204) {
                        setPharmacies(pharmacies.filter((pharmacy) => pharmacy.id !== pharmacyId));
                        Notiflix.Notify.failure("Pharmacy deleted successfully");
                    } else {
                        Notiflix.Notify.failure("Failed to delete Pharmacy");
                    }
                } catch (error) {
                    Notiflix.Notify.failure("Failed to delete Pharmacy");
                }

            },
            () => {
                console.log('If you say so...');
            },
            {},
        );
    };


    const handleAddPharmacy = (newPharmacy) => {
        // add new pharmacy to list of pharmacies
        setPharmacies([...pharmacies, newPharmacy]);
    };
    const [showModal, setShowModal] = useState(false);

    const handleEdit = (pharmacy) => {
        setEditedPharmacy(pharmacy);
        setShowModal(true);
    };

    const updatePharmacy = (updatedPharmacy) => {
        const updatedPharmacies = pharmacies.map((pharmacy) => pharmacy.id === updatedPharmacy.id ? updatedPharmacy : pharmacy)
        setPharmacies(updatedPharmacies);
    };
    const onHideModal = () => {
        setShowModal(false);
        setEditedPharmacy(null);
    };

    const showMap = (lal, long, pharmacy) => {
        setMapModalIsOpen(true);
        if (lal && long) {
            setAlt(lal);
            setLong(long);
            setSelectedPharmacy(pharmacy);
        }
    };

    const handleChangeState = (pharmacyId, newState) => {
        // Find the pharmacy in the list by its ID
        const pharmacyToUpdate = pharmacies.find(pharmacy => pharmacy.id === pharmacyId);
        console.log(pharmacyToUpdate);
        // Update the state of the pharmacy
        pharmacyToUpdate.state = newState;
        const response = axios.put(`/api/pharmacies/${pharmacyId}/state`, newState, {
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            Notiflix.Notify.success("state has changed successfully ");
            setPharmacies(prevPharmacies => prevPharmacies.map(pharmacy => pharmacy.id === pharmacyToUpdate.id ? pharmacyToUpdate : pharmacy));
        });
    }
    return (<div className="pharmacies-container">
            <h1>Pharmacies</h1>
            <FormCreate currentLocation={currentLocation} onAddPharmacy={handleAddPharmacy}/>
            {editedPharmacy && (<UpdateForm
                showModal={showModal}
                onHide={onHideModal}
                pharmacy={editedPharmacy}
                updatePharmacy={updatePharmacy}
                currentLocation={currentLocation}
            />)}
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
                    <th>Show on map</th>
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
                        <button onClick={() => showMap(pharmacy.altitude, pharmacy.longitude, pharmacy)}>show map
                        </button>
                    </td>
                    <td>
                        <div className="d-flex align-items-center">
                        <span
                            className={`badge ${pharmacy.state === 0 ? "bg-warning" : pharmacy.state === 1 ? "bg-success" : pharmacy.state === 2 ? "bg-danger" : "inherit"}`}>
                        {pharmacyStates[pharmacy.state]}
                     </span>
                            <DropdownButton id="state-dropdown" variant="outline-secondary" title="" size='sm'>
                                <Dropdown.Item onClick={() => handleChangeState(pharmacy.id, 0)}>Waiting</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleChangeState(pharmacy.id, 1)}>Accept</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleChangeState(pharmacy.id, 2)}>Refuse</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </td>
                    <td>{pharmacy.zone && pharmacy.zone.name}
                    </td>
                    <td>
                        <FontAwesomeIcon icon={faTrash} className="text-danger cursor"
                                         onClick={() => handleDelete(pharmacy.id)}/>
                        <button className="btn btn-secondary" onClick={() => handleEdit(pharmacy)}>Edit</button>
                    </td>
                </tr>))}
                </tbody>
            </table>
            <Modal show={mapModalIsOpen} onHide={() => {
                setMapModalIsOpen(false)
            }}
                   size='xl'
                   aria-labelledby="contained-modal-title-vcenter"
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Pharmacy on Map</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map center={[alt, long]} selectedPharmacy={selectedPharmacy}/>
                </Modal.Body>


            </Modal>

        </div>

    )

}