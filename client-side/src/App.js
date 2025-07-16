import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Home from "./Pages/Home";
import Bookings from "./Pages/Bookings.jsx";
import Profile from "./Pages/UserDashboard";
import Auth from "./Pages/Auth";
import CarBooking from "./Pages/CarBooking.jsx";
import PaymentPage from "./Pages/PaymentPage.jsx";
import { useAuth } from "./context/AuthContext";
import AdminAuth from "./Pages/AdminAuth.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import AddCar from "./Pages/AddCar.jsx";

const stripePromise = loadStripe("pk_test_51QzBJxDnBAfJYbRZnryC2mJUayYsv4fKO0paYGlTnyb3bBJqyeLPkSbgC53tfrpFxfTjXPWVmE3o9TYKOtoJc7VL00lRQ9Prtm");

function ProtectedRoute({ element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/authuser" replace />;
  if (user.role === "admin" && element.type === Profile) return <Navigate to="/dashboard" replace />;
  return element;
}

function AdminRoute({ element }) {
  const { user } = useAuth();
  return user?.role === "admin" ? element : <Navigate to="/" replace />;
}

function App()
{
  const { user } = useAuth();
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            <Route path="/authuser" element={<Auth />} />
            <Route path="/authadmin" element={<AdminAuth />} />
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/bookings" element={<ProtectedRoute element={<Bookings />} />} />
            <Route path="/car/:id" element={<ProtectedRoute element={<CarBooking />} />} />
            <Route path="/profile" element={user?.role === "admin" ? <Navigate to="/dashboard" /> : <ProtectedRoute element={<Profile />} />} />
            <Route path="/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
            <Route path="/payment" element={<ProtectedRoute element={<PaymentPage />} />} />
            <Route path="/managecar" element={<AdminRoute element={<AddCar />} />} />
          </Routes>
        </Router>
      </Elements>
    </div>
  );
}

export default App;
