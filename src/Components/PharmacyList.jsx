import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Modal from "react-modal";
import {ToastContainer, toast} from 'react-toastify';
import ConfirmationModal from "./ConfirmationModel";


export default function PharmacyList({zoneId}) {
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [zones, setZones] = useState([]);
    const [pharmacyIdToDelete, setPharmacyIdToDelete] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {

        const fetchPharmacies = async () => {
            const result = await axios.get("/api/pharmacies");
            setPharmacies(result.data);
            console.log(result.data);
        }
        fetchPharmacies();

    }, []);
    useEffect(() => {

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
            const response = await axios.put(`api/pharmacies/acceptPharmacie/id=${selectedPharmacy.id}`);
            if (response.status === 200 || response.status === 201) {
                // Update the state with the new values
                const updatedPharmacy = {...selectedPharmacy, etat: 1};
                setPharmacies(prevPharmacies => prevPharmacies.map(pharmacy => pharmacy.id === updatedPharmacy.id ? updatedPharmacy : pharmacy));
                toast.success("Pharmacy accepted successfully");

            } else {
                toast.error("Failed to accept pharmacy");
            }
        } catch (error) {
            toast.error("Failed to accept pharmacy");
        }
        handleCloseModal();
    };
    const refusePharmacy = async () => {
        try {
            const response = await axios.put(`api/pharmacies/refusePharmacie/id=${selectedPharmacy.id}`);
            if (response.status === 200 || response.status === 201) {
                // Update the state with the new values
                const updatedPharmacy = {...selectedPharmacy, etat: 2};
                setPharmacies(prevPharmacies => prevPharmacies.map(pharmacy => pharmacy.id === updatedPharmacy.id ? updatedPharmacy : pharmacy));
                toast.success("Pharmacy refused successfully");
            } else {
                toast.error("Failed to refuse   pharmacy");
            }
        } catch (error) {
            toast.error("Failed to refuse pharmacy");
        }
        handleCloseModal();
    };
    return (

        <div>
            <h2>Pharmacies</h2>
            <Link to={`/create-zone`} className="btn btn-primary">
                Add Pharmacy
            </Link>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>State</th>
                    <th>Zone</th>

                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {pharmacies.map((pharmacy) => (<tr key={pharmacy.id}>
                    <td>{pharmacy.id}</td>
                    <td>{pharmacy.nom}</td>
                    <td>{pharmacy.adresse}</td>
                    <td>{pharmacy.laltitude}</td>
                    <td>{pharmacy.longitude}</td>
                    <td>
                        <button
                            className={
                                pharmacy.etat === 0 ? "btn btn-warning" :
                                    pharmacy.etat === 1 ? "btn btn-success" :
                                        pharmacy.etat === 2 ? "btn btn-danger" : "inherit"
                            }
                            onClick={() => handleOpenModal(pharmacy)}>
                            {
                                pharmacy.etat === 0 ? "WAITING" :
                                    pharmacy.etat === 1 ? "ACCEPTED" :
                                        pharmacy.etat === 2 ? "REJECTED" : null
                            }</button>
                    </td>

                    <td>{pharmacy.zone && pharmacy.zone.nom}
                    </td>

                    <td>
                        <button className="btn btn-danger">
                            Delete
                        </button>
                        <button className="btn btn-primary">
                            Edit
                        </button>
                    </td>
                </tr>))}
                </tbody>
            </table>
            <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
                <h3>Etat de la Pharmacie</h3>
                <button className="btn btn-success" onClick={acceptPharmacy}>
                    Accept
                </button>
                <button className="btn btn-danger" onClick={refusePharmacy}>
                    Refuse
                </button>
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                    Abort
                </button>


            </Modal>
        </div>
    )
}