import React, {useState, useEffect} from "react";
import axios from "axios";
import "../../styles/editZone-modal.css";
import {Form} from "react-bootstrap";

export default function OndutyHistory() {
    const [pharmacies, setPharmacies] = useState([]);

    // eslint-disable-next-line no-unused-vars
    const [zones, setZones] = useState([]);

    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        const fetchPharmacies = async () => {

               const result = await axios.get("/api/pharmacies/garde/all");
            setPharmacies(result.data);
        }
        fetchPharmacies();

        const fetchZones = async () => {
            const result = await axios.get("/api/zones");
            setZones(result.data);
        }
        fetchZones();

    }, []);

    const toggleIsNight = () => {
        setIsNight(!isNight);
    };


    const filteredPharmacies = isNight ? pharmacies.filter((pharmacy) => pharmacy.garde.type === "nuit") : pharmacies;
    //console.log(filteredPharmacies);
    return ( <>
        <h2>history of on-duty pharmacies</h2>
        <div className="pharmacies-container">
            <Form>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    checked={isNight} onChange={toggleIsNight}
                    label="Pharmacies open at night"
                />
            </Form>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Jour/Nuit</th>
                </tr>
                </thead>
                <tbody>
                {filteredPharmacies.map((pharmacy) => (<tr key={pharmacy.pharmacy.id}>
                    <td>{pharmacy.pharmacy.id}</td>
                    <td>{pharmacy.pharmacy.name}</td>
                    <td>{pharmacy.pharmacy.address}</td>
                    <td>
                        {new Date(pharmacy.startDate).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            timeZone: 'UTC'
                        })}
                    </td>
                    <td>
                        {new Date(pharmacy.endDate).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            timeZone: 'UTC'
                        })}
                    </td>
                    <td>{pharmacy.garde.type}</td>
                </tr>))}
                </tbody>
            </table>

        </div>
    </>)

}