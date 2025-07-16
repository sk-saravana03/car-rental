import React from "react";

const RazorpayPayment = ({ amount, name, email }) => {
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load Razorpay. Check your internet.");
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_TEST_KEY", // Replace with your test/live key
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency: "INR",
      name: "GearUp Rentals",
      description: "Car Rental Payment",
      image: "/logo.png", // Optional logo
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        sendInvoice(email, amount); // Send invoice function
      },
      prefill: {
        name: name,
        email: email,
        contact: "9999999999", // Dummy number, replace in live mode
      },
      theme: { color: "#007bff" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const sendInvoice = (email, amount) => {
    console.log(`Invoice sent to ${email} for ₹${amount}`);
  };

  return (
    <div>
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
};

export default RazorpayPayment;
