import {Button, Col, Container, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import AuthService from "../../Services/auth.service";
import Notiflix from "notiflix";
import authHeader from "../../Services/auth-header";
import apiUrl from "../../config";


export default function OndutyForm() {
    const [gardeId, setGardeId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});
    const [pharmacies, setPharmacies] = useState([]);
    const [isNight, setIsNight] = useState(false);

    const fetchPharmacies = async () => {
        const user = AuthService.getCurrentUser();
        const result = await axios.get(`${apiUrl}/pharmaciesgarde/pharmacy/${user.email}`, {headers: authHeader()});
        console.log(result.data);
        setPharmacies(result.data);
    };
    useEffect(() => {
        fetchPharmacies();

    }, []);

    const toggleIsNight = () => {
        setIsNight(!isNight);
    };
    const filteredPharmacies = isNight ? pharmacies.filter((pharmacy) => pharmacy.garde.type === "nuit") : pharmacies;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = AuthService.getCurrentUser().email;
        const response = await axios.get(`${apiUrl}/pharmacies/user/${email}`);
        const pharmacy = response.data;
        const pharmacyId = pharmacy?.id;
        const parsedGardeId = parseInt(gardeId);
        axios.put(`${apiUrl}/pharmaciesgarde/add/${pharmacyId}?gardeId=${parsedGardeId}&startDate=${startDate}&endDate=${endDate}`, {},{headers: authHeader()})
            .then(response => {
                // Refresh the table by fetching the updated data
                fetchPharmacies();
                // Clear the form inputs
                setGardeId('');
                setStartDate('');
                setEndDate('');
                Notiflix.Notify.success("Garde added successfully");
                //console.log(response.data);
            })
            .catch(error => {
console.log(error.response)
                if (error.response.data.Approbation) {
                    Notiflix.Report.failure('Access Control', error.response.data.Approbation, 'Okay',);
                }
                setErrors(error.response.data);
            });
    };


    return (
        <>
            <Container>
                <Row>
                    <Col md={3}>
                        <Container
                            className="col-xl-5 col-lg-5 col-md-5 col-xl-9 col-10 mt-5 p-4 border rounded shadow">
                            <h6>Add On-Duty Pharmacy</h6>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="gardeId">
                                    <Form.Control as="select" value={gardeId}
                                                  onChange={(event) => setGardeId(event.target.value)}>
                                        <option value="">Select Garde</option>
                                        <option value="1">Day</option>
                                        <option value="2">Night</option>
                                    </Form.Control>
                                    {errors.garde && <Form.Text className="text-danger">{errors.garde}</Form.Text>}
                                </Form.Group>
                                <Form.Group controlId="startDate">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" value={startDate}
                                                  onChange={(event) => setStartDate(event.target.value)}/>
                                    {errors.startDate &&
                                        <Form.Text className="text-danger">{errors.startDate}</Form.Text>}
                                </Form.Group>
                                <Form.Group controlId="endDate">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" value={endDate}
                                                  onChange={(event) => setEndDate(event.target.value)}/>
                                    {errors.endDate && <Form.Text className="text-danger">{errors.endDate}</Form.Text>}
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Container>
                    </Col>
                    <Col md={9}>
                        <div className="pharmacies-container">
                            <Form>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    checked={isNight}
                                    onChange={toggleIsNight}
                                    label="Pharmacies open at night"
                                />
                            </Form>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Day/Night</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredPharmacies.map((pharmacy, index) => (
                                    <tr key={index}>
                                        <td>
                                            {new Date(pharmacy.startDate).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                timeZone: "UTC",
                                            })}
                                        </td>
                                        <td>
                                            {new Date(pharmacy.endDate).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                timeZone: "UTC",
                                            })}
                                        </td>
                                        <td>{pharmacy.garde.type}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>

    )
}