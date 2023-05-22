import React, {useState, useEffect} from "react";
import axios from "axios";
import "../../styles/editZone-modal.css";
import {Form} from "react-bootstrap";
import authHeader from "../../Services/auth-header";

export default function OndutyHistory() {
    const [pharmacies, setPharmacies] = useState([]);

    // eslint-disable-next-line no-unused-vars
    const [zones, setZones] = useState([]);

    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        const fetchPharmacies = async () => {

               const result = await axios.get("http://localhost:8080/api/v1/pharmaciesgarde/all",{ headers: authHeader() })
            console.log(result.data);
            // Filter pharmacies based on the date criteria
            const currentDate = new Date(); // Get the current date
            const currentDay = currentDate.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
            const startDate = new Date(currentDate); // Copy the current date
            const endDate = new Date(currentDate); // Copy the current date
            startDate.setDate(startDate.getDate() - currentDay); // Set the start date to the previous Sunday
            endDate.setDate(endDate.getDate() - currentDay + 6); // Set the end date to the next Saturday

            const filteredPharmacies = result.data.filter((pharmacy) => {
               // const gardeStartDate = new Date(pharmacy.startDate);
                const gardeEndDate = new Date(pharmacy.endDate);
                const lastSunday = new Date(currentDate);
                lastSunday.setDate(lastSunday.getDate() - currentDay);
                lastSunday.setDate(lastSunday.getDate() - 7); // Subtract an additional 7 days to go back to the previous week

                return gardeEndDate < lastSunday;
            });
        setPharmacies(filteredPharmacies)
            console.log(filteredPharmacies);
        }
        fetchPharmacies();

        const fetchZones = async () => {
            const result = await axios.get("http://localhost:8080/api/v1/zones",{ headers: authHeader() })
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

        <div className="pharmacies-container">
            <h2>History of on-duty pharmacies</h2>
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
                    <th>Day/Night</th>
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