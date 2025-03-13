import React from "react";
import AppointmentForm from "../components/AppointmentForm";

const BookingPage = ({ driverId }) => {
  return (
    <div>
      <h2>Book an Appointment</h2>
      <AppointmentForm driverId={driverId} />
    </div>
  );
};

export default BookingPage;
