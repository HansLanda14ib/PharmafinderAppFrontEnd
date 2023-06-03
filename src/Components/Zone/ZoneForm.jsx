import React, {useState, useEffect} from "react";
import axios from "axios";

import Notiflix from 'notiflix';
import {useNavigate} from "react-router-dom";
import authHeader from "../../Services/auth-header";
import apiUrl from "../../config";


const ZoneForm = ({onZoneAdded}) => {
    const [name, setName] = useState("");
    const [cityId, setCityId] = useState("");
    const [cities, setCities] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/v1/cities`).then((response) => {
            setCities(response.data);
        });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !cityId) {
            Notiflix.Notify.warning("Name and city are required");

            return;
        }

        try {
            const response = await axios.post(
                `${apiUrl}/zones/save?name=${name}&cityId=${cityId}`,
                {},
                { headers: authHeader() }
            );

            if (response.status === 200 || response.status === 201) {
                setName("");
                setCityId("");
                Notiflix.Notify.success('Zone added successfully');
                navigate(-1);

            } else {

                Notiflix.Notify.failure('Failed to add zone');

            }
        } catch (error) {
            console.log(error);
            Notiflix.Notify.failure('Failed to add zone');
        }
    };


    return (<form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div className="form-group">
            <label htmlFor="cityId">City:</label>
            <select
                className="form-control"
                id="cityId"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
            >
                <option value="">Select a city</option>
                {cities && cities.map((city) => (<option key={city.id} value={city.id}>
                    {city.name}
                </option>))}
            </select>
        </div>
        <button type="submit" className="btn btn-primary">
            Add Zone
        </button>
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
            theme="dark"
        /> */}
    </form>);
};

export default ZoneForm;