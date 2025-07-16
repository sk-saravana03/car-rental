import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import Slidebar from "../components/Slidebar";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const { data } = await axios.get("/api/admin/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(data);
      } catch (error) {
        console.error("Error fetching reports:", error.response?.data?.message || error.message);
      }
    };
    fetchReports();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <Slidebar/>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      <div className="bookings-container">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <p><strong>User:</strong> {booking.userId?.email}</p>
              <p><strong>Car:</strong> {booking.carId?.brand} {booking.carId?.model}</p>
              <p><strong>Start:</strong> {new Date(booking.startTime).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(booking.endTime).toLocaleString()}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
