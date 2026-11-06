import React, { useState } from "react";
import { BsFillLightningFill,BsShieldCheck,BsCreditCard2Back ,BsSafe2Fill} from "react-icons/bs";
import mpesalogo from "./images/safLogo.png";
import Sidebar from "./pages/Sidebar";
import mpesa from './images/mpesa.png'

import "./Mpesa.css"

function Mpesa() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // "error" | "success" | "info"
  const [loading, setLoading] = useState(false);

  const API_URL = "https://kellcom-mpesa.onrender.com";

  // Check the payment status using polling
  const checkStatus = (checkoutRequestId) => {
    let attempts = 0;
    const maxAttempts = 20; // Poll for up to 60 seconds 
    const interval = setInterval(async () => { 
      attempts += 1;

      try {
        const res = await fetch(`${API_URL}/api/v1/payment-status/${checkoutRequestId}`);
        const data = await res.json();
        console.log("Status update from server:", data);

        // Extract values regardless of backend casing/naming
        const status = data.status || data.Status;
        const resultCode = data.resultCode ?? data.ResultCode;

        // 1. SUCCESS (ResultCode 0)
        if (status === "SUCCESS" || resultCode === 0) {
          setFeedback("Payment completed successfully!");
          setFeedbackType("success");
          setLoading(false);
          clearInterval(interval);
        } 
        // 2. USER CANCELLED (ResultCode 1032)
        else if (status === "CANCELLED" || resultCode === 1032) {
          setFeedback("Payment cancelled by the user.");
          setFeedbackType("error");
          setLoading(false);
          clearInterval(interval);
        } 
        // 3. WRONG PIN (ResultCode 2001)
        else if (status === "WRONGPIN" || resultCode === 2001) {
          setFeedback("Wrong PIN entered.");
          setFeedbackType("error");
          setLoading(false);
          clearInterval(interval);
        } 
        // 4. TIMEOUT / USER UNREACHABLE (ResultCode 1037)
        else if (status === "TIMEOUT" || resultCode === 1037) {
          setFeedback("Payment timed out. Phone was unreachable.");
          setFeedbackType("error");
          setLoading(false);
          clearInterval(interval);
        } 
        // 5. INSUFFICIENT BALANCE (ResultCode 1)
        else if (status === "LOW_BALANCE" || resultCode === 1) {
          setFeedback("Insufficient M-Pesa balance.");
          setFeedbackType("error");
          setLoading(false);
          clearInterval(interval);
        } 
        // 6. ANY OTHER FAILED RESULT
        else if (status === "FAILED" || (resultCode !== undefined && resultCode !== null)) {
          setFeedback(`Payment failed: ${data.message || data.ResultDesc || "Transaction dropped"}`);
          setFeedbackType("error");
          setLoading(false);
          clearInterval(interval);
        } 
        // 7. STILL PENDING - Check for timeout cap
        else if (attempts >= maxAttempts) {
          setFeedback("Payment status check timed out. Please try again.");
          setFeedbackType("error");
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        if (attempts >= maxAttempts) {
          setFeedback("Error reaching server to confirm payment status.");
          setFeedbackType("error");
          setLoading(false);
          clearInterval(interval);
        }
      }
    }, 3000);
  };

  /*Sample recent payments data
  const recentPayments = [
    { recipient: '0712345678', amount: 500.00, date: '2026-10-28', status:  'QRXWUDJJNG' },
    { recipient: '0722123456', amount: 1000.00, date: '2026-10-27', status: 'HGIOORPBH3' },
    { recipient: '0733789012', amount: 2500.00, date: '2026-10-27', status: 'KVU3B58BW2' },
    { recipient: '0788112233', amount: 10000.00, date: '2026-10-26', status:'AEWEWVT9O0' },
  ];
*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !amount) {
      setFeedback("Please enter phone number and amount.");
      setFeedbackType("error");
      return;
    }

    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    setLoading(true);
    setFeedback("Sending STK push...");
    setFeedbackType("info");

    try {
      const res = await fetch(`${API_URL}/api/v1/stk-push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formattedPhone, amount }),
      });

      const data = await res.json();

      if (data.CheckoutRequestID) {
        setFeedback("Check your phone and enter your M-Pesa PIN...");
        setFeedbackType("info");
        checkStatus(data.CheckoutRequestID);
      } else {
        setFeedback("Failed to initiate STK push.");
        setFeedbackType("error");
        setLoading(false);
      }
    } catch (err) {
      setFeedback("Network error sending STK push.");
      setFeedbackType("error");
      setLoading(false);
    }
  };

  return (
  <>
   
    <div className="dashboard">
      <Sidebar />
        
      <div className="F-content"> 
      
        <div className="mform-container">
          
     
          <form onSubmit={handleSubmit}>
            <img src={mpesalogo} alt="Safaricom Logo" className="logo" />

            <input
              type="text"
              className="input-f"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />

            <input
              type="number"
              className="input-f"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Processing..." : `Pay ${amount ? `Ksh ${amount}` : ""}`}
            </button>

            {feedback && (
              <div className={`feedback ${feedbackType}`}>
                {feedback}
              </div>
            )}
          </form>
        </div>

      {/*recent payments*/}
      <div className="recent-payments-container">
             
                       
             <img src={mpesa} alt="" width={600} height={300} />

             
<div className="payment-info-card">
  <h3>Your Payments, Made Simple</h3>
  <p className="payment-info-subtitle">
    Enjoy a convenient and secure way to manage your payments.
  </p>

  <div className="payment-info-item">
    <div className="payment-info-icon"><BsFillLightningFill/></div>
    <div>
      <h4>Fast Payments</h4>
      <p>Make payments conveniently from your dashboard.</p>
    </div>
  </div>

  <div className="payment-info-item">
    <div className="payment-info-icon"><BsShieldCheck/></div>
    <div>
      <h4>Secure Transactions</h4>
      <p>Confirm every payment securely using your M-Pesa PIN.</p>
    </div>
  </div>

  <div className="payment-info-item">
    <div className="payment-info-icon"><BsCreditCard2Back/></div>
    <div>
      <h4>Easy Tracking</h4>
      <p>Keep track of your payment history anytime.</p>
    </div>
  </div>

  <div className="payment-info-footer">
    <BsSafe2Fill/> Simple. Secure. Convenient.
  </div>
</div>

          </div>
        
     
    

      </div>
      
    </div>
    
  </>
);
}

export default Mpesa;