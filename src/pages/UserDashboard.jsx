import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/user/appointments")
      .then(response => setAppointments(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Your Dashboard</h2>
      <div>
        {appointments.map((appointment) => (
          <div key={appointment.id}>
            <p>{appointment.details}</p>
            <ReviewForm appointmentId={appointment.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
