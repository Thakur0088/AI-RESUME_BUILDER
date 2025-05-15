const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const dotenv = require("dotenv");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const User = require("./models/User"); // Import the User model
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, "users.json");
const upload = multer({ dest: "uploads/" });

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send("Error fetching users.");
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).send("Error creating user.");
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Updating user with ID:", req.params.id);
    console.log("Request body:", req.body);
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) return res.status(404).send("User not found.");
    res.send({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).send("Error updating user.");
  }
});

app.patch("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) return res.status(404).send("User not found.");
    res.send({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).send("Error updating user.");
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).send("User not found.");
    res.send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).send("Error deleting user.");
  }
});

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("File upload request received."); // Debugging

    // Check if a file was uploaded
    if (!req.file) {
      console.error("No file uploaded.");
      return res.status(400).json({ error: "No file uploaded." });
    }

    console.log("File uploaded successfully:", req.file.originalname);

    // Read the uploaded file
    const fileData = fs.readFileSync(path.join(__dirname, req.file.path));
    const pdfData = await pdfParse(fileData);
    const extractedText = pdfData.text;

    console.log("Extracted text size:", Buffer.byteLength(extractedText, "utf8"));

    // Check if the extracted text size exceeds the limit
    if (Buffer.byteLength(extractedText, "utf8") > 200 * 1024) {
      console.error("Extracted text size exceeds the 200KB limit.");
      return res.status(400).json({ error: "Extracted text size exceeds the 200KB limit." });
    }

    // Check if the TextRazor API key is available process.env.TEXTRAZOR_API_KEY;
    const textrazorApiKey = process.env.TEXTRAZOR_API_KEY;
    if (!textrazorApiKey) {
      console.error("TextRazor API Key is missing.");
      return res.status(500).json({ error: "TextRazor API Key is missing." });
    }

    console.log("Sending request to TextRazor API...");

    // Configure the TextRazor API request
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-textrazor-key": textrazorApiKey,
      },
    };

    const formData = new URLSearchParams();
    formData.append("text", extractedText);
    formData.append("extractors", "entities,topics,words,sentiment");

    // Send the extracted text to the TextRazor API
    const response = await axios.post("https://api.textrazor.com", formData.toString(), config);
    console.log("TextRazor API response received.");

    // Extract data from the TextRazor API response
    const entitiesCount = response.data.response.entities ? response.data.response.entities.length : 0;
    const topics = response.data.response.topics ? response.data.response.topics.length : 0;
    const sentiment = response.data.response.sentiment ? response.data.response.sentiment.aggregate : 0;

    // Define maximum thresholds for scoring
    const maxEntities = 100;
    const maxTopics = 10;
    const maxSentiment = 1;

    // Calculate individual scores
    const entityScore = Math.min((entitiesCount / maxEntities) * 100, 100);
    const topicScore = Math.min((topics / maxTopics) * 100, 100);
    const sentimentScore = Math.min((sentiment / maxSentiment) * 100, 100);

    // Calculate the final score
    const score = entityScore * 0.4 + topicScore * 0.3 + sentimentScore * 0.3;
    console.log("Resume evaluation completed. Score:", score);

    // Return the score and feedback
    
    res.json({
      score,
      feedback: response.data.response.feedback || "No feedback available",
    });
  } catch (error) {
    console.error("Error scoring resume:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error processing resume. Please try again." });
  }
});

// OTP Feature
// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email
async function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tanshdeep56@gmail.com", // Replace with your email
      pass: "eldj frsn gauw ytil", // Replace with your app password
    },
  });

  const mailOptions = {
    from: '"My Resume Builder" <your_email@gmail.com>',
    to: email,
    subject: "Verify Your Email",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

// Signup with OTP endpoint
app.post("/api/signup-with-otp", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("Email already registered.");

    const otp = generateOTP();
    const newUser = new User({
      name,
      email,
      password,
      otp,
      otpExpiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    });

    await newUser.save();
    await sendOTPEmail(email, otp);
    res.status(201).send("OTP sent to your email. Please verify.");
  } catch (error) {
    res.status(500).send("Error during signup.");
  }
});

// Verify OTP endpoint
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found.");
    if (user.isVerified) return res.status(400).send("User is already verified.");
    if (Date.now() > user.otpExpiresAt) return res.status(400).send("OTP has expired.");

    if (user.otp === otp) {
      user.isVerified = true;
      user.isActive = true; // Automatically activate the account
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();
      res.send("Email verified and account activated successfully!");
    } else {
      res.status(400).send("Invalid OTP.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP.");
  }
});

// Get all users
app.get('/api/admin/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    console.log("Fetched users:", users); // Debugging
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users.");
  }
});

// Delete a user
app.delete('/api/admin/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Deleting user with ID:", userId); // Debugging
    const deletedUser = await User.findByIdAndDelete(userId); // Delete the user by ID
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Activate/Deactivate a user
app.patch('/api/admin/users/:id/toggle', authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the isActive status
    user.isActive = !user.isActive;

    // Save the updated user to the database
    const updatedUser = await user.save();

    console.log("Updated user in database:", updatedUser); // Debugging
    res.status(200).json({ message: "User status updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Error toggling user status" });
  }
});

// Update a user
app.put('/api/admin/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id; // Extract user ID from the URL
    const { name, email, role } = req.body; // Extract updated fields from the request body
    console.log("Updating user with ID:", req.params.id);
    console.log("Request body:", req.body);

    const user = await User.findById(userId); // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save(); // Save the updated user
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordValid = password === user.password; // Replace with bcrypt.compare if hashed
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

mongoose.connect("mongodb://localhost:27017/resumeBuilder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a PDF file first.");
    return;
  }
  const formData = new FormData();
  formData.append("resume", selectedFile);
  setUploading(true); // Show uploading state
  setEvaluation(null); // Clear previous evaluation results

  try {
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error("Failed to upload");
    }

    const result = await response.json();
    setEvaluation(result); // Store the evaluation results in the state
  } catch (error) {
    alert(error.message || "Error uploading resume.");
  } finally {
    setUploading(false); // Reset uploading state
  }
};