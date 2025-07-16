import React, { use, useState } from "react";
import axios from "axios"; // Import axios for API calls
import { Link, useNavigate } from "react-router-dom"; // Use navigate for redirection
import "../styles/Auth.css";
import { useAuth } from "../context/AuthContext";

const Auth = () =>
{
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });
  const [error, setError] = useState(null);
  const [carState, setCarState] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth();

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) =>
  {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value.trim(),
    });
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    setError(null);
    setIsLoading(true)
    try {
      if (isLogin) {
        // Login API request
        const { data } = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", data.token); // Store token
        alert("Login Successfully!");
        login(data.user);
        navigate("/"); // Redirect after login



      } else {
        // Registration API request
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          setIsLoading(false)
          return;
        }
        
        await axios.post("http://localhost:5000/api/auth/register", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        
        alert("Registration Successfully! Redirecting to login...");
        setIsLogin(true);
        setFormData({ ...formData, fullName: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      console.log(formData);
      setCarState("hazard");
      setError(err.response?.data?.message || "Failed to authenticate. Please try again!");
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="auth-container">
      <div className={`car-animation ${carState}`}></div>
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange} required />
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          {!isLogin && (
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          )}
          {isLogin && (
            <label>
              <input type="checkbox" name="remember" checked={formData.remember} onChange={handleChange} /> Remember Me
            </label>
          )}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing" : isLogin ? "Login" : "Register"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
        <Link to={"/authadmin"} className="toggle-authadmin" >
          <button>
            Are you Admin? Click here
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Auth;
