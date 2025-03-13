// src/pages/DriverSearchPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DriverCard from "../components/DriverCard";

const DriverSearchPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/drivers?search=${query}`)
      .then(response => setDrivers(response.data))
      .catch(error => console.error(error));
  }, [query]);

  return (
    <div>
      <h2>Search for Drivers</h2>
      <input
        type="text"
        placeholder="Enter location or name"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div>
        {drivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>
    </div>
  );
};

export default DriverSearchPage;
