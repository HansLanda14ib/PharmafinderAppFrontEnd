import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import authHeader from "../../Services/auth-header";
import apiUrl from '../../config.js';

const CityForm = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const city = {name: name}
        console.log(city);
        axios.post(`${apiUrl}/cities/save`,city, {headers: authHeader()})
            .then(() => {
            navigate(-1);
        });
    };

    return (
        <>
            <h2>Add City</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add
                </button>
            </form>
        </>
    );
};

export default CityForm;
