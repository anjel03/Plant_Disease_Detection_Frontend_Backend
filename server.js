const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a user schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/views/signup.html");
});
app.get("/dashboard", (req, res) => {
  console.log("Requested /dashboard");
  res.sendFile(__dirname + "/views/dashboard.html");
});
app.get("/predictions", (req, res) => {
  return res.redirect("http://127.0.0.1:5000/");
});
app.get("/know-more", (req, res) => {
  res.sendFile(__dirname + "/views/farming-info.html");
});

app.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send(
      '<script>alert("Passwords do not match"); window.location.href = "/signup";</script>'
    );
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.send(
      '<script>alert("User already exists. Please log in."); window.location.href = "/signup";</script>'
    );
  }

  // Create a new user
  const newUser = new User({
    username,
    email,
    password,
  });

  // Save the user to the database
  await newUser.save();

  return res.redirect("/");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ username, password });

  if (user) {
    return res.redirect("/dashboard");
  } else {
    return res.send(
      '<script>alert("Invalid username or password. Please sign up."); window.location.href = "/";</script>'
    );
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
