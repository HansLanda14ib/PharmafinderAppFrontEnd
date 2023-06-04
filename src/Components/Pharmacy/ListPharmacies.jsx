import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import "../../styles/pharmaciesStyle.css";
import Notiflix from 'notiflix';
import {Confirm} from 'notiflix/build/notiflix-confirm-aio';
import CreatePharmacy from "./CreatePharmacy";
import UpdatePharmacy from "./UpdatePharmacy";
import {DropdownButton} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import Map from "../Map/Map";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import {Icon} from "leaflet/src/layer/marker";
import authHeader from "../../Services/auth-header";
import AuthService from "../../Services/auth.service";
import './cursor.css';
import apiUrl from "../../config";
const mypharmacies=[
     {
         "id": 1,
         "name": "manar pharmacy",
         "address": "a marrakech hivernage",
         "phone": "0688033778",
         "altitude": 31.621228395415503,
         "longitude": -8.027744293212892,
         "state": 1,
         "zone": {
             "id": 1,
             "name": "Hivernage",
             "city": {
                 "id": 1,
                 "name": "Marrakech"
             }
         }
     },
     {
         "id": 2,
         "name": "labase pharmacy",
         "address": "targa",
         "phone": "0524033787",
         "altitude": 31.651262566610033,
         "longitude": -8.058128356933596,
         "state": 1,
         "zone": {
             "id": 2,
             "name": "Sidi ghanem",
             "city": {
                 "id": 1,
                 "name": "Marrakech"
             }
         }
     },
     {
         "id": 4,
         "name": "talbourjt pharmacy",
         "address": "a talbourjt agadir",
         "phone": "0688093778",
         "altitude": 30.412632322494165,
         "longitude": -9.566345214843752,
         "state": 1,
         "zone": {
             "id": 12,
             "name": "Talbourjt",
             "city": {
                 "id": 6,
                 "name": "Agadir"
             }
         }
     },
     {
         "id": 5,
         "name": "pharmacy taddart",
         "address": "a taddart agadir",
         "phone": "0688037896",
         "altitude": 30.46472888494151,
         "longitude": -9.549865722656252,
         "state": 2,
         "zone": {
             "id": 13,
             "name": "Taddart",
             "city": {
                 "id": 6,
                 "name": "Agadir"
             }
         }
     },
     {
         "id": 6,
         "name": "pharmacy agdal",
         "address": "au agdal rabat",
         "phone": "0688037896",
         "altitude": 34.03078943899101,
         "longitude": -6.826629638671876,
         "state": 2,
         "zone": {
             "id": 8,
             "name": "Agadal",
             "city": {
                 "id": 3,
                 "name": "Rabat"
             }
         }
     },
     {
         "id": 7,
         "name": "pharmacy ainchok",
         "address": "a Ain chock Casa",
         "phone": "0688037896",
         "altitude": 33.56328275381754,
         "longitude": -7.597045898437501,
         "state": 1,
         "zone": {
             "id": 11,
             "name": "Ainchok",
             "city": {
                 "id": 2,
                 "name": "Casablanca"
             }
         }
     },
     {
         "id": 8,
         "name": "pharmacy medina ",
         "address": "a medina marrakech ",
         "phone": "0688037809",
         "altitude": 31.644150729333415,
         "longitude": -7.9737424859195025,
         "state": 1,
         "zone": {
             "id": 9,
             "name": "Medina",
             "city": {
                 "id": 1,
                 "name": "Marrakech"
             }
         }
     },
     {
         "id": 9,
         "name": "pharmacy sidi ghanem",
         "address": "a sidi ghanem marrakech",
         "phone": "0688037896",
         "altitude": 31.66763660225885,
         "longitude": -8.03203582763672,
         "state": 1,
         "zone": {
             "id": 2,
             "name": "Sidi ghanem",
             "city": {
                 "id": 1,
                 "name": "Marrakech"
             }
         }
     }
 ]

export default function ListPharmacies() {
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [editedPharmacy, setEditedPharmacy] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [zones, setZones] = useState([]);
    const [mapModalIsOpen, setMapModalIsOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const pharmacyStates = {0: "WAITING", 1: "ACCEPTED", 2: "REJECTED",};
    const [alt, setAlt] = useState('');
    const [long, setLong] = useState('');
    const {zoneId} = useParams();

    const [searchInput, setSearchInput] = useState('');
    const [searchSelect, setSearchSelect] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    useEffect(() => {
        axios.get(`${apiUrl}/zones`, {headers: authHeader()})
            .then((response) => {
                setZones(response.data);
            })
    }, [])

    useEffect(() => {
        if (zoneId) {
            axios.get(`${apiUrl}/pharmacies/zone/id=${zoneId}`, {headers: authHeader()})
                .then((response) => {
                    setPharmacies(response.data);
                })
        } else {
            axios.get(`${apiUrl}/pharmacies`, {headers: authHeader()})
                .then((response) => {
                    //console.log(response.data);
                    setPharmacies(response.data);
                })
        }

    }, [zoneId])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            setCurrentLocation([latitude, longitude]);

        });
    }, [])

    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);

        }

    }, []);

    const handleDelete = async (pharmacyId) => {

        Confirm.show('Delete Confirm', 'Are you you want to delete?', 'Delete', 'Abort', async () => {
            try {
                const response = await axios.delete(`${apiUrl}/pharmacies/deletePharmacy/id=${pharmacyId}`, {headers: authHeader()});

                if (response.status === 200 || response.status === 204) {
                    setPharmacies(pharmacies.filter((pharmacy) => pharmacy.id !== pharmacyId));
                    Notiflix.Notify.failure("Pharmacy deleted successfully");
                } else {
                    Notiflix.Notify.failure("Failed to delete Pharmacy");
                }
            } catch (error) {
                Notiflix.Notify.failure("Failed to delete Pharmacy");
            }

        }, () => {
            console.log('If you say so...');
        }, {},);
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
       // console.log(pharmacyToUpdate);
        // Update the state of the pharmacy
        pharmacyToUpdate.state = newState;
        // eslint-disable-next-line no-unused-vars
        const response = axios.put(`${apiUrl}/pharmacies/${pharmacyId}/state/${newState}`, null, {
            headers: authHeader()
        }).then(response => {
            Notiflix.Notify.success("state has changed successfully ");
            setPharmacies(prevPharmacies => prevPharmacies.map(pharmacy => pharmacy.id === pharmacyToUpdate.id ? pharmacyToUpdate : pharmacy));
        });
    }

    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
        const filterFunction = (pharmacy) => {
            switch (searchSelect) {
                case '1':
                    return pharmacy.name.toLowerCase().includes(searchValue.toLowerCase());
                case '2':
                    return pharmacy.address.toLowerCase().includes(searchValue.toLowerCase());
                case '3':
                    return pharmacy.zone?.name?.toLowerCase().includes(searchValue.toLowerCase());
                default:
                    return true;
            }
        };
        setFilteredResults(pharmacies.filter(filterFunction));
        /* const filteredPharmacies = pharmacies.filter((pharmacy) => {
     const values = {
         ...pharmacy,
         zoneName: pharmacy.zone.name
     };
     const searchValues = Object.values(values).join('').toLowerCase();
     console.log(searchValues);
     return searchValues.includes(searchInput.toLowerCase());
 })*/

    };


    const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/4287/4287703.png",
        iconSize: [38, 38],
    });

    const renderPharmacy = (pharmacy) => {
        return (

            <tr key={pharmacy.id}>
                <td>{pharmacy.name}</td>
                <td>{pharmacy.address}</td>
                <td>{pharmacy.phone}</td>
                <td>{pharmacy.zone.name}</td>
                <td>
                    {pharmacy.altitude !== 0 && pharmacy.longitude !== 0 && (
                        <img className="location-link" width={customIcon.options.iconSize[0]} height={customIcon.options.iconSize[1]}
                             src={customIcon.options.iconUrl} alt="Location Icon"
                             onClick={() => showMap(pharmacy.altitude, pharmacy.longitude, pharmacy)
                             }
                        />

                    )}
                </td>
                {currentUser?.role === 'ADMIN' &&
                    <td>
                        <div className="d-flex align-items-center">
          <span
              className={`badge ${pharmacy.state === 0 ? "bg-warning" : pharmacy.state === 1 ? "bg-success" : pharmacy.state === 2 ? "bg-danger" : "inherit"}`}>
            {pharmacyStates[pharmacy.state]}
          </span>

                            <DropdownButton id="state-dropdown" variant="outline-secondary" title="" size="sm">
                                <Dropdown.Item onClick={() => handleChangeState(pharmacy.id, 0)}>Waiting</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleChangeState(pharmacy.id, 1)}>Accept</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleChangeState(pharmacy.id, 2)}>Refuse</Dropdown.Item>
                            </DropdownButton>

                        </div>
                    </td>
                }
                {currentUser?.role === 'ADMIN' &&
                    <td>

                        <FontAwesomeIcon icon={faTrash} className="location-link"
                                         onClick={() => handleDelete(pharmacy.id)}/>
                        <button className="btn btn-secondary" onClick={() => handleEdit(pharmacy)}>
                            Edit
                        </button>
                    </td>
                }
            </tr>

        );

    };
    return (<>

        <div className="pharmacies-container">
            <CreatePharmacy currentLocation={currentLocation} onAddPharmacy={handleAddPharmacy}/>
            <Link to={`/map`} className="btn btn-secondary">
                Pharmacies on Map
            </Link>
            <br/> <br/>
            <Form className="d-flex">
                <Form.Select style={{width: "120px"}} size='sm' onChange={(e) => {
                    setSearchSelect(e.target.value)
                }}>
                    <option>Search by:</option>
                    <option key='searchSelect1' value="1">Name</option>
                    <option key='searchSelect2' value="2">Address</option>
                    <option key='searchSelect3' value="3">Zone</option>
                </Form.Select>
                <Form.Control
                    type="search"
                    placeholder="Search for Pharmacies by Zone"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => searchItems(e.target.value)}

                />
            </Form>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Zone</th>
                    <th>On Map</th>
                    {currentUser?.role === 'ADMIN' && <th>State</th>}
                    {currentUser?.role === 'ADMIN' && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {searchInput.length > 1
                    ? filteredResults.map((pharmacy) => renderPharmacy(pharmacy))
                    : pharmacies.map((pharmacy) => renderPharmacy(pharmacy))}
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
        {editedPharmacy && (<UpdatePharmacy
            showModal={showModal}
            onHide={onHideModal}
            pharmacy={editedPharmacy}
            updatePharmacy={updatePharmacy}
            currentLocation={currentLocation}
        />)}

    </>)

}