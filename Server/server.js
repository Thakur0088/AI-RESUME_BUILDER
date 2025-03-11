const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const dotenv = require("dotenv");
const pdfParse = require("pdf-parse");

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, "users.json");
const upload = multer({ dest: "uploads/" });

const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.get("/api/users", (req, res) => {
  res.json(readUsers());
});

app.post("/api/signup", (req, res) => {
  const users = readUsers();
  const newUser = req.body;
  newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  writeUsers(users);
  res.status(201).send({ message: "User created successfully", user: newUser });
});

app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  let users = readUsers();
  let userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) return res.status(404).send("User not found.");
  users[userIndex] = { id: userId, ...req.body };
  writeUsers(users);
  res.send({ message: "User updated successfully." });
});

app.patch("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  let users = readUsers();
  let user = users.find((user) => user.id === userId);
  if (!user) return res.status(404).send("User not found.");
  Object.assign(user, req.body);
  writeUsers(users);
  res.send({ message: "User updated successfully." });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  let users = readUsers();
  const filteredUsers = users.filter((user) => user.id !== userId);
  if (users.length === filteredUsers.length) return res.status(404).send("User not found.");
  writeUsers(filteredUsers);
  res.send({ message: "User deleted successfully." });
});



app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const fileData = fs.readFileSync(path.join(__dirname, req.file.path));
    const pdfData = await pdfParse(fileData);
    const extractedText = pdfData.text;
    if (Buffer.byteLength(extractedText, "utf8") > 200 * 1024) {
      return res.status(400).json({ error: "Extracted text size exceeds the 200KB limit." });
    }
    const textrazorApiKey = process.env.TEXTRAZOR_API_KEY;
    if (!textrazorApiKey) return res.status(500).json({ error: "TextRazor API Key is missing." });
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-textrazor-key": textrazorApiKey,
      },
    };

    const formData = new URLSearchParams();
    formData.append("text", extractedText);
    formData.append("extractors", "entities,topics,words,sentiment");
    const response = await axios.post("https://api.textrazor.com", formData.toString(), config);
    const entitiesCount = response.data.response.entities ? response.data.response.entities.length : 0;
    const topics = response.data.response.topics ? response.data.response.topics.length : 0;
    const sentiment = response.data.response.sentiment ? response.data.response.sentiment.aggregate : 0;

    const maxEntities = 100
    const maxTopics = 10
    const maxSentiment = 1;

    const entityScore = Math.min((entitiesCount / maxEntities) * 100, 100);
    const topicScore = Math.min((topics / maxTopics) * 100, 100);
    const sentimentScore = Math.min((sentiment / maxSentiment) * 100, 100);

    const score = (entityScore * 0.4) + (topicScore * 0.3) + (sentimentScore * 0.3);
    res.json({ score, feedback: response.data.response.feedback || "No feedback available" });
  } catch (error) {
    console.error("Error scoring resume:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error processing resume. Please try again." });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
