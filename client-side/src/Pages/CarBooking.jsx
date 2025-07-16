import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CarBooking.css";

const CarBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [serviceType, setServiceType] = useState("days");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [withDriver, setWithDriver] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Fetch Car & Slots (Real-Time)
  useEffect(() => {
    const fetchCarAndSlots = async () => {
      try {
        const { data: fetchedCar } = await axios.get(`http://localhost:5000/api/car/${id}`);
        setCar(fetchedCar);

        const { data: bookedDate } = await axios.get(`http://localhost:5000/api/booking/slots/${id}`);
        setBookedSlots(bookedDate);
      } catch (error) {
        console.error("Error fetching car or slots:", error);
      }
    };

    fetchCarAndSlots();
    const interval = setInterval(fetchCarAndSlots, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, [id]);

  // Calculate Price
  useEffect(() => {
    if (from && to) {
      const start = new Date(from);
      const end = new Date(to);
      let price = car.rentPerDay;
      let driverCost = 0;

      if (serviceType === "days") {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        price = days * (car?.rentPerDay || 0);
        driverCost = withDriver ? days * 1000 : 0;
      } else {
        const hours = Math.ceil((end - start) / (1000 * 60 * 60));
        price = hours * (car?.rentPerDay || 0);
      }

      setTotalPrice(price + driverCost);
    }
  }, [from, to, serviceType, car, withDriver]);

  // Handle Booking
  const handleBooking = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/booking/book",
        {
          carId: id,
          startTime: from,
          endTime: to
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      
      navigate(`/payment?amount=${totalPrice}&carId=${id}&from=${from}&to=${to}`);
    } catch (error) {
      alert("Booking failed. Try again!");
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="car-booking-container">
      {car && (
        <>
          <div className="car-image-section">
            <img src={`http://localhost:5000${car.image}`} alt={car.name} className="car-image-booking" />
            {/* <div className="car-tags">
              {car.tags.map((tag, index) => (
                <span key={index} className="car-tag">{tag}</span>
              ))}
            </div> */}
          </div>

          <div className="car-info-section">
            <h2>{car.brand} {car.model} ({car.year})</h2>
            <div className="service-selection">
              <label>
                <input type="radio" value="days" checked={serviceType === "days"} onChange={() => setServiceType("days")} />
                Rent by Days
              </label>
              <label>
                <input type="radio" value="hours" checked={serviceType === "hours"} onChange={() => setServiceType("hours")} />
                Rent by Hours
              </label>
            </div>
            <div className="date-selection">
              <label>From:</label>
              <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
              <label>To:</label>
              <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="driver-selection">
              <label>
                <input type="checkbox" checked={withDriver} onChange={() => setWithDriver(!withDriver)} />
                Add Driver (+₹1000/day)
              </label>
            </div>
            <button className="payment-button" onClick={handleBooking}>
              Pay ₹{totalPrice}
            </button>
          </div>
        </>
      )}

      {/* Display booked slots */}
      <div className="booked-slots">
        <h3>Booked Slots</h3>
        <ul>
          {bookedSlots?.map((slot, index) => (
            <li key={index}>
              {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarBooking;
