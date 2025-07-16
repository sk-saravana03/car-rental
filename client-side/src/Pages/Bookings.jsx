import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slidebar from "../components/Slidebar.jsx";
import axios from "axios";
import "../styles/Booking.css";

const Booking = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/booking/my-bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const cancelBooking = async (booking) => {
    if (!booking || !booking.car) return;
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel the booking for ${booking.car?.name || "this car"}?`
    );
    if (!confirmCancel) return;

    try {
      const { data } = await axios.delete(`http://localhost:5000/api/booking/cancel/${booking._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(`Booking Cancelled! Refund Amount: ₹${data?.refundAmount || 0}`);
      setBookings(bookings?.map(b =>
        b._id === booking._id ? { ...b, status: "Cancelled", refundAmount: data?.refundAmount || 0 } : b
      ));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div className="booking-container">
      <Slidebar />
      <h1>My Bookings</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings?.length > 0 ? (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div key={booking?._id || Math.random()} className="booking-card">
              <img src={booking?.car?.image ? `http://localhost:5000${booking.car.image}` : "placeholder.jpg"} 
                   alt={booking?.car?.name || "Car Image Not Available"} />
              <h3>{booking?.car?.name || "Unknown Car"} ({booking?.car?.year || "N/A"})</h3>
              <p>From: {booking?.startTime ? new Date(booking.startTime).toLocaleString() : "Not available"}</p>
              <p>To: {booking?.endTime ? new Date(booking.endTime).toLocaleString() : "Not available"}</p>
              <p>Total Price: ₹{booking?.totalPrice || "N/A"}</p>
              <p>Status: {booking?.status || "Unknown"}</p>
              {booking?.status === "Cancelled" && <p>Refund: ₹{booking?.refundAmount || 0}</p>}
              <Link to={`/car/${booking?.car?._id || "#"}`}>
                <button className="view-btn">View Details</button>
              </Link>
              {booking?.status !== "Cancelled" && (
                <button className="cancel-btn" onClick={() => cancelBooking(booking)}>
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default Booking;
