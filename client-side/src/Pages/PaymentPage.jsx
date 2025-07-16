import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../styles/Payment.css"
const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1); // Step 1: Payee Details, Step 2: Payment
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [payeeDetails, setPayeeDetails] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    pin: "",
  });

  const handleChange = (e) => {
    setPayeeDetails({ ...payeeDetails, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!payeeDetails.name || !payeeDetails.email || !payeeDetails.location || !payeeDetails.pin || !payeeDetails.phone) {
      setMessage("All fields are required.");
      return;
    }
    setStep(2); // Move to payment step
    setMessage("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setMessage("Stripe is not loaded yet.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error } = await stripe.createToken(cardElement);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Payment Successful! Invoice sent to your email.");
      sendInvoice(); // Call invoice function
    }

    setLoading(false);
  };

  const sendInvoice = () => {
    // Simulating invoice sending
    console.log(`Invoice sent to ${payeeDetails.email} for ${payeeDetails.name}`);
    console.log(`Invoice sent to ${payeeDetails.phone} for ${payeeDetails.name}`);
  };

  return (
    <div className="payment-container">
      <h2>{step === 1 ? "Enter Payee Details" : "Complete Your Payment"}</h2>

      {step === 1 ? (
        <div className="payee-details">
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="number" name="phone" placeholder="phone no." onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
          <input type="text" name="pin" placeholder="PIN Code" onChange={handleChange} required />
          <button onClick={handleNext}>Proceed to Payment</button>
        </div>
      ) : (
        <form onSubmit={handlePayment}>
          <CardElement className="card-input" />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}

      {message && <p className="payment-message">{message}</p>}
    </div>
  );
};

export default PaymentPage;
