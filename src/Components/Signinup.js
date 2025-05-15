import React, { useState } from "react";
import { FaFacebook, FaGoogle, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signinup.css";

const Signinup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For popup message
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signup-with-otp", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setMessage(response.data);
      setIsOtpSent(true); // Show OTP input after signup
    } catch (error) {
      setMessage(error.response?.data || "Error during signup.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      setMessage(""); // Clear any previous messages
      setSuccessMessage("OTP verified! Account created successfully."); // Show success message
      setIsModalOpen(false); // Close the modal
      setIsOtpSent(false); // Reset OTP input

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data || "Error during OTP verification.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);

      const { token, user } = response.data; // Assuming the backend sends token and user info
      if (token && user) {
        localStorage.setItem("token", token); // Store the token
        localStorage.setItem("user", JSON.stringify({ username: user.name, role: user.role })); // Store username and role

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin-dashboard"); // Redirect to admin dashboard
        } else {
          navigate("/"); // Redirect to main page
        }
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("There was an error verifying your credentials.");
    }
  };

  return (
    <div className="signin-page">
      <nav className="navbar1">
        <div className="nav-icons1">
          <p className="webname1">
            <span className="large-text1">resume.com</span>
            <span className="small-text1">by smoother</span>
          </p>
        </div>
      </nav>

      <div className="Container1">
        <div className="centercontent">
          <h1>Log In</h1>
          <p>We are happy to see you back!</p>

          {/* Email & Password Fields Side by Side */}
          <div className="input-container">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button className="login-btn" onClick={handleLogin}>Login</button>

          <div className="signinoptions">
            <button className="facebook">
              <FaFacebook className="icon" /> Facebook
            </button>
            <button className="google">
              <FaGoogle className="icon" /> Google
            </button>
            <button className="linkedin">
              <FaLinkedin className="icon" /> LinkedIn
            </button>
            <button className="email">
              <FaEnvelope className="icon" /> Email
            </button>
          </div>

          <p>
            I am not registered yet.{" "}
            <button
              type="button"
              onClick={openModal}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Modal for Create Account */}
      <div className="modal-overlay" style={{ display: isModalOpen ? "block" : "none" }}>
        <div className="modal-content">
          <button className="close-btn" onClick={closeModal}>X</button>
          <h2>{isOtpSent ? "Verify OTP" : "Sign Up"}</h2>
          <form onSubmit={isOtpSent ? handleVerifyOtp : handleSignup}>
            {!isOtpSent && (
              <>
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            {isOtpSent && (
              <div className="input-group">
                <label>OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter the OTP sent to your email"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <button type="submit" className="login-btn">
              {isOtpSent ? "Verify OTP" : "Sign Up"}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>

      {/* Success Popup */}
      {successMessage && (
        <div className="success-popup">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Signinup;
