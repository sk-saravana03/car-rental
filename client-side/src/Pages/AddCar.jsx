import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AddCar.css";
import Slidebar from "../components/Slidebar";

const AddCar = () =>
{
  const [showForm, setShowForm] = useState(false);
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    year: "",
    fuel: "Petrol",
    transmission: "Automatic",
    rentPerDay: "",
    maxPassengers: "",
    lastService: "",
    mileage: "",
    // tags: [],
    image: null
  });

  const tagOptions = ["Hills", "Long Drive", "Family", "Luxury", "Sports"];

  useEffect(() =>
  {
    fetchCars();
  }, []);

  const fetchCars = async () =>
  {
    try {
      const response = await axios.get("http://localhost:5000/api/car");
      setCars(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleChange = (e) =>
  {
    const { name, value } = e.target;
    setCarData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) =>
  {
    setCarData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleTagSelection = (tag) =>
  {
    setCarData((prev) =>
    {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(carData).forEach((key) =>
    {
      if (key === "tags") {
        carData.tags.forEach((tag) => formData.append("tags", tag));
      } else {
        formData.append(key, carData[key]);
      }
    });

    try {
      const token = localStorage.getItem("adminToken");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      // console.log(token)

      if (editingCar) {
        await axios.put(`http://localhost:5000/api/car/update/${editingCar._id}`, formData, { headers });
        alert("Car updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/car/add", formData, { headers });
        alert("Car added successfully!");
        console.log(formData);
      }

      fetchCars();
      setCarData({
        brand: "",
        model: "",
        year: "",
        fuel: "Petrol",
        transmission: "Automatic",
        rentPerDay: "",
        maxPassengers: "",
        lastService: "",
        mileage: "",
        // tags: [],
        image: null
      });
      setEditingCar(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding/updating car:", error);
      alert("Failed to add/update car!");
    }
  };

  const handleEdit = (car) =>
  {
    setEditingCar(car);
    setCarData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      fuel: car.fuel,
      transmission: car.transmission,
      rentPerDay: car.rentPerDay,
      maxPassengers: car.maxPassengers,
      lastService: car.lastService,
      mileage: car.mileage,
      // tags: car.tags,
      image: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) =>
  {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/car/delete/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        alert("Car deleted successfully!");
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Failed to delete car!");
      }
    }
  };

  return (
    <div className="add-car-section">
      <Slidebar />
      <button className="add-car-button" onClick={() =>
      {
        setShowForm(!showForm);
        setEditingCar(null);
      }}>
        {showForm ? "X Close" : " + Add Car"}
      </button>

      {showForm && (
        <div className="add-car-container">
          <h2 className="add-car-header">{editingCar ? "Edit Car" : "Add a New Car"}</h2>
          <form className="add-car-form" onSubmit={handleSubmit}>

            <label>Brand</label>
            <input type="text" name="brand" placeholder="Car Brand" value={carData.brand} onChange={handleChange} required />

            <label>model</label>
            <input type="text" name="model" placeholder="Car model" value={carData.model} onChange={handleChange} required />

            <label>Year of Buying</label>
            <input type="number" name="year" placeholder="Year" value={carData.year} onChange={handleChange} required />

            <label>Fuel Type</label>
            <select name="fuel" value={carData.fuel} onChange={handleChange}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
            </select>

            <label>Transmission</label>
            <select name="transmission" value={carData.transmission} onChange={handleChange}>
              <option>Automatic</option>
              <option>Manual</option>
            </select>

            <label>Rent per Day (₹)</label>
            <input type="number" name="rentPerDay" placeholder="Rent Amount" value={carData.rentPerDay} onChange={handleChange} required />

            <label>maxPassengers</label>
            <input type="number" name="maxPassengers" placeholder="max no. of passangers" value={carData.maxPassengers} onChange={handleChange} required />

            <label>last service</label>
            <input type="date" name="lastService" value={carData.lastService} onChange={handleChange} required />
            
            <label>mileage</label>
            <input type="number" name="mileage"  value={carData.mileage} onChange={handleChange} required />

            <label>Upload Car Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required={editingCar} />

            <button type="submit" className="add-car-submit">
              {editingCar ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}

      <div className="car-list">
        <h2>Car List</h2>
        {Array.isArray(cars) && cars.length > 0 ? (
          cars.map((car) => (
            <div key={car._id} className="car-item">
              <img src={`http://localhost:5000${car.image}`} alt={car.name} className="car-image" />
              <p><strong>{car.name}</strong> - {car.brand}</p>
              <p>₹{car.rentPerDay}/day</p>
              <button onClick={() => handleEdit(car)}>Edit</button>
              <button onClick={() => handleDelete(car._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No cars available.</p>
        )}
      </div>
    </div>
  );
};

export default AddCar;
