import React, { useState, useEffect } from "react";
import { FaEdit, FaCar, FaClock, FaStar, FaIdCard, FaKey, FaTrash, FaUpload, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slidebar from "../components/Slidebar";
import "../styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () =>
{
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState({ section: null, data: {} });
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  
  const {login} = useAuth()

  useEffect(() =>
  {
    fetchUserData();
  }, []);

  const fetchUserData = async () =>
  {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/authuser");
      
      const response = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
      navigate("/authuser");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) =>
  {
    setEditing({ section, data: { ...user } });
  };

  const handleChange = (e) =>
  {
    setEditing({ ...editing, data: { ...editing.data, [e.target.name]: e.target.value } });
  };

  const handleSave = async () =>
  {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/user/update", editing.data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(editing.data);
      setEditing({ section: null, data: {} });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user info", error);
      setMessage("Failed to update profile.");
    }
  };

  const handleCancel = () =>
  {
    setEditing({ section: null, data: {} });
  };

  const handleProfilePicUpload = async (e) =>
  {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePreview(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append("profilePicture", file);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/user/upload-profile", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setUser({ ...user, profilePicture: response.data.profilePicture });
      setMessage("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile picture", error);
      setMessage("Failed to upload profile picture.");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div className="dashboard-container">
      <Slidebar />
      {message && <p className="message">{message}</p>}
      <div className="profile-header">
        <img src={profilePreview || user.profilePicture || "https://via.placeholder.com/100"} alt="Profile" className="profile-pic" />
        <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="upload-input" />
        <FaUpload className="upload-icon" />
      </div>
      
      <div className="dashboard-segment">
        <h3>Basic Information <FaEdit onClick={() => handleEdit("basic")} className="edit-icon" /></h3>
        {editing.section === "basic" ? (
          <>
            <input type="text" name="name" value={editing.data.name} onChange={handleChange} />
            <input type="email" name="email" value={editing.data.email} onChange={handleChange} />
            <button onClick={handleSave}>Save</button>
            <FaTimes onClick={handleCancel} className="cancel-icon" />
          </>
        ) : (
          <>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        )}
      </div>
      
      <div className="dashboard-segment">
        <h3>Booking Statistics</h3>
        <p><FaCar /> Cars Booked: <strong>{user.rentedCars.length}</strong></p>
        <p><FaClock /> Total Travel Time: <strong>{user.totalTravelTime || "N/A"}</strong></p>
        <p><FaStar /> Reward Points: <strong>{user.rewardPoints || 0}</strong></p>
      </div>
      
      <div className="dashboard-segment">
        <h3>Personal Information <FaEdit onClick={() => handleEdit("personal")} className="edit-icon" /></h3>
        {editing.section === "personal" ? (
          <>
            <input type="text" name="aadharNumber" placeholder="New Aadhar Number" onChange={handleChange} />
            <input type="text" name="licenseNumber" placeholder="New License Number" onChange={handleChange} />
            <button onClick={handleSave}>Save</button>
            <FaTimes onClick={handleCancel} className="cancel-icon" />
          </>
        ) : (
          <>
            <p><FaIdCard /> Aadhaar No.: <strong>**** **** **** {user.aadharNumber?.slice(-4)}</strong></p>
            <p><FaKey /> License No.: <strong>**** {user.licenseNumber?.slice(-4)}</strong></p>
          </>
        )}
      </div>
      
      <button className="delete-btn"><FaTrash /> Delete Account</button>
    </div>
  );
};

export default UserDashboard;
