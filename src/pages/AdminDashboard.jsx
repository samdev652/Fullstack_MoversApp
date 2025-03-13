import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/admin/payments")
      .then(response => setPayments(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            {payment.details} - {payment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
