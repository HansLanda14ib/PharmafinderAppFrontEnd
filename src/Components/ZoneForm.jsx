import React, {useState, useEffect} from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify';

const ZoneForm = ({onZoneAdded}) => {
    const [name, setName] = useState("");
    const [cityId, setCityId] = useState("");
    const [cities, setCities] = useState([]);


    useEffect(() => {
        axios.get("/api/cities").then((response) => {
            setCities(response.data);
        });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !cityId) {
            toast.error("Name and city are required");
            return;
        }

        const data = new URLSearchParams(`nom=${name}&ville_id=${cityId}`);

        try {
            const response = await axios.post(`/api/zones/save?${data}`);

            if (response.status === 200 || response.status === 201) {
                setName("");
                setCityId("");
                toast.success("Zone added successfully");
            } else {
                toast.error("Failed to add zone");
            }
        } catch (error) {
            toast.error("Failed to add zone");
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
                            {city.nom}
                        </option>))}
                </select>
            </div>
            <button type="submit" className="btn btn-primary">
                Add Zone
            </button>
        <ToastContainer
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
        />
        </form>);
};

export default ZoneForm;