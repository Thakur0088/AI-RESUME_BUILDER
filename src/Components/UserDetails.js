import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDetails.css";
import illustration from "../Images/personwithlaptop.png"; // Replace with your actual image

const UserDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobRole: "",
    experience: "",
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userDetails", JSON.stringify(formData));
    navigate("/template-selection");
  };

  return (
    <>
      <div className="step-progress">
        <div className="step">1</div>
        <div className="step">2</div>
        <div className="step">3</div>
      </div>
      <div className="user-details-container">
        <div className="user-details-left">
          <img src={illustration} alt="Person with phone" />
        </div>
        <div className="user-details-right">
          <h2>Fill in your details</h2>
          <p>Let’s get started by knowing you better!</p>
          <form className="user-details-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input name="jobRole" placeholder="Job Role" onChange={handleChange} required />
            <select name="experience" onChange={handleChange} required>
              <option value="">Select Experience Level</option>
              <option value="fresher">Fresher</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
            </select>
            <button type="submit">Continue</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
