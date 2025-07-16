import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuth } from "../context/AuthContext";

const AdminAuth = () =>
{
  const [isLogin, setIsLogin] = useState(true);
  const [carState, setCarState] = useState("")
  const [formData, setFormData] = useState({
    username: "",  // Changed from 'name' to 'username' ✅
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) =>
  {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {

      alert("Passwords do not match!");  // Prevents wrong password entry
      return;
    }

    try {
      const url = isLogin
        ? "http://localhost:5000/api/admin/login"
        : "http://localhost:5000/api/admin/register";
      
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      // console.log("Sending Data:", payload); // Debugging log ✅

      const { data } = await axios.post(url, payload);
      localStorage.setItem("adminToken", data.token);
      console.log("token Stored : ", data.token);
      
      login(data.user);
      navigate("/dashboard");
    } catch (error) {
      setCarState("hazard");
      console.log(formData);
      console.error("Auth error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className={`car-animation ${carState}`}></div>
      <div className="auth-box">

        <h2>{isLogin ? "Admin Login" : "Admin Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username" // Changed 'name' to 'username' ✅
              placeholder="Username"
              onChange={handleChange}
              required
            />
          )}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          {!isLogin && (
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          )}
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
        <Link to={"/authuser"} className="toggle-authadmin" >
          <button>
            Are you User? Click here
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminAuth;
