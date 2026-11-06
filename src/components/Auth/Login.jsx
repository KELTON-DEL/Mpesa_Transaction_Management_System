
import "./Signup.css";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  BsFillCartCheckFill,
  BsPaypal,
  BsSend,
  BsClockHistory
} from "react-icons/bs";

function Login() {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_URL = "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setFeedback("");

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const data = response.data;

      if (data.success && data.token) {

        // Save authentication token
        localStorage.setItem("token", data.token);

        // Save logged-in user information
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setFeedback("Login successful!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);

      } else {
        setFeedback(data.message || "Login failed. Please try again.");
      }

    } catch (error) {
      console.log("Login error:", error);

      if (error.response) {
        setFeedback(
          error.response.data.message || "Invalid email or password."
        );
      } else {
        setFeedback("Unable to connect to the server. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sigup-container">

        <div className="side-container">
          <div className="actions">

            <h2>Fast. Secure. Convenient</h2>

            <p className="action-description">
              Make payments and track your transactions
              securely from one place.
            </p>

            <h4><BsPaypal /> Pay Bills</h4>
            <h4><BsSend /> Send Money</h4>
            <h4><BsFillCartCheckFill /> Buy Goods</h4>
            <h4><BsClockHistory /> View Transaction History</h4>

          </div>
        </div>

        <div className="form">
          <form
            className="form-container"
            onSubmit={handleSubmit}
          >

            <h1>Welcome back!</h1>

            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <h3>
              Don't have an account?

              <Link className="inf" to="/signup">
                <span> Sign up</span>
              </Link>
            </h3>

            {feedback && (
              <p
                className={
                  feedback.includes("successful") ? "success" : "error"
                }
              >
                {feedback}
              </p>
            )}

          </form>
        </div>

      </div>
    </>
  );
}

export default Login;