import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import authHeader from "../../Services/auth-header";



const CityList = () => {
    const [cities, setCities] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("http://localhost:8080/api/v1/cities",{ headers: authHeader() });
            setCities(result.data);

        };
        fetchData();
    }, []);


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this city?")) {
            axios.delete(`http://localhost:8080/api/v1/cities/${id}`,{headers: authHeader() }).then(() => {
                setCities(cities.filter((city) => city.id !== id));
            });
        }
    };

    const handleEdit = (id) => {
        const newName = window.prompt("Enter the new name for this city:");
        if (newName) {
            axios.put(`http://localhost:8080/api/v1/cities/${id}`, {name: newName},{ headers: authHeader() }).then(() => {
                setCities(cities.map((city) => {
                    if (city.id === id) {
                        return {...city, name: newName};
                    }
                    return city;
                }));
            });
        }
    };

    return (
        <div className="pharmacies-container">
            <h2>City List</h2>
            <Link to="/add-city" className="btn btn-primary">
                Add City
            </Link>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cities.map((city) => (
                    <tr key={city.id}>
                        <td>{city.id}</td>
                        <td>{city.name}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDelete(city.id)}>
                                Delete
                            </button>
                            <button className="btn btn-secondary ml-2" onClick={() => handleEdit(city.id)}>
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
};

export default CityList;
