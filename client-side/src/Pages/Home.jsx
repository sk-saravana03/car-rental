import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";
import Slidebar from "../components/Slidebar";
import SearchBar from "../components/SearchBar.jsx";

function Home() {
  const [cars, setCars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [fuelFilter, setFuelFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [stickyTitle, setStickyTitle] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null)

  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://localhost:5000/api/car")
      .then(response => setCars(response.data))
      .catch(error => console.error("Error fetching cars:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 3) {
        setShowGrid(true);
        setStickyTitle(true);
      } else {
        setShowGrid(false);
        setStickyTitle(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    try {
        const response = await fetch(`/api/cars/search?name=${query}`);
        if (!response.ok) throw new Error("Failed to fetch search results");

        const data = await response.json();
        console.log("Search Results:", data);

        // You can update state here if needed
        // setSearchResults(data);
    } catch (error) {
        console.error("Search error:", error);
    }
};


  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? cars.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === cars.length - 1 ? 0 : prevIndex + 1));
  };

  const filteredCars = Array.isArray(cars) ? cars.filter(car =>
    (fuelFilter === "all" || car.fuel?.toLowerCase() === fuelFilter) &&
    (transmissionFilter === "all" || car.transmission?.toLowerCase() === transmissionFilter)
  ) : [];

  const sortedCars = filteredCars.length > 0 ? [...filteredCars].sort((a, b) => {
    const rentA = a.rentPerDay ? parseInt(String(a.rentPerDay).replace(/\D/g, ""), 10) : 0;
    const rentB = b.rentPerDay ? parseInt(String(b.rentPerDay).replace(/\D/g, ""), 10) : 0;
  
    return sortOrder === "asc" ? rentA - rentB : rentB - rentA;
  }) : [];
  

  // console.log(cars[currentIndex].image || []);

  return (
    <div className="home-container">
      <Slidebar />
      <div className="slider-image">
        <SearchBar onSearch={handleSearch} onSelectCar={setSelectedCar} />

        {/* If no cars are available */}
        {cars.length === 0 ? (
          <h1>No cars available</h1>
        ) : (
          <>
            {cars[currentIndex] ? (
              <>
                {cars[currentIndex].image ? (
                  <img src={`http://localhost:5000${cars[currentIndex].image}`} alt="Car" className="car-image-home" />
                ) : (
                  <h1>Image is not supported or available</h1>
                )}

                <div className="details">
                  <h2>{cars[currentIndex].brand || "Brand Unknown"} {cars[currentIndex].model || "Model Unknown"}</h2>
                  <p>{cars[currentIndex].transmission || "Transmission Unknown"} | {cars[currentIndex].fuel || "Fuel Unknown"}</p>
                  <p>Last Service: {cars[currentIndex].lastService || "Not Available"}</p>
                  <p>Mileage: {cars[currentIndex].mileage || "Unknown"}</p>
                  <p>Capacity: {cars[currentIndex].maxPassengers || "Unknown"}</p>
                  <button className="rent-btn" onClick={() => navigate(`/car/${cars[currentIndex]._id}`)}>
                    Rent for {cars[currentIndex].rentPerDay || "Not Available"}
                  </button>
                </div>
              </>
            ) : (
              <h1>Car details not available</h1>
            )}
          </>
        )}
      </div>

      {showGrid && (
        <div className="car-listing">
          <h2 className={`gearup-title ${stickyTitle ? "sticky" : ""}`}>GearUp Rentals</h2>
          <div className="filters">
            <select onChange={(e) => setFuelFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
            </select>
            <select onChange={(e) => setTransmissionFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
            <select onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
          <div className="grid">
            {sortedCars.length === 0 ? (
              <h1>No cars match the selected filters</h1>
            ) : (
              sortedCars.map(car => (
                <div key={car.id} className="car-card">
                  {car?.image ? (
                    <img src={`http://localhost:5000${car.image}`} alt="Car" />
                  ) : (
                    <h1>Image is not supported or available</h1>
                  )}
                  <h3>{car.brand || "Brand Unknown"} {car.model} ({ car.year})</h3>
                  <button className="rent-btn" onClick={() => navigate(`/car/${car._id}`)}>
                    {car.rentPerDay || "Not Available"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
