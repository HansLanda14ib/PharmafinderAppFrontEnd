import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../Services/auth-header";

const ZoneByCity = () => {
  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/cities",{ headers: authHeader() }).then((response) => {
      setCities(response.data);
    });
  }, []);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCityId(cityId);
    if(cityId !==0){
      axios.get(`http://localhost:8080/api/v1/zones/zone/city=${cityId}`,{ headers: authHeader() }).then((response) => {
        setZones(response.data);
      });
    }
    else{
      axios.get(`http://localhost:8080/api/v1/zones`,{ headers: authHeader() }).then((response) => {
        setZones(response.data);
    });
    }
  };

  return (
    <div className="pharmacies-container">
      <h2>Zones by City</h2>
      <div className="form-group">
        <label htmlFor="cityId">Select a city:</label>
        <select
          className="form-control"
          id="cityId"
          value={selectedCityId}
          onChange={handleCityChange}
        >
          <option value="0">All cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city?.name}
            </option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.id}>
              <td>{zone?.id}</td>
              <td>{zone?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ZoneByCity;
