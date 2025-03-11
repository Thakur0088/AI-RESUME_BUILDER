import React, { useState } from "react";
import { FaFacebook, FaGoogle, FaLinkedin, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import "./Signinup.css";

// Modal Component for Sign Up
const CreateAccountModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signup", formData);
      console.log("Account created:", response.data);
      alert("Account successfully created!");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" placeholder="Enter your username" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
          </div>
          <button type="submit" className="submit-btn">Create Account</button>
        </form>
      </div>
    </div>
  );
};

const Signinup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogin = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      const users = response.data;

      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        alert(`${user.username} is successfully logged in!`);
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <a href="#" onClick={openModal}>Sign Up</a>
          </p>
        </div>
      </div>

      {/* Modal for Create Account */}
      <CreateAccountModal show={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Signinup;
