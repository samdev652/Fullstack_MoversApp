// src/pages/DriverDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const DriverDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/driver/appointments")
      .then(response => setAppointments(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleApproval = (appointmentId, status) => {
    axios.post(`http://127.0.0.1:5000/api/appointments/${appointmentId}/approve`, { status })
      .then(() => alert("Appointment updated!"))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Driver Dashboard</h2>
      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <p>{appointment.details}</p>
          <button onClick={() => handleApproval(appointment.id, "approved")}>Approve</button>
          <button onClick={() => handleApproval(appointment.id, "rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default DriverDashboard;
