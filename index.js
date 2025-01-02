// Import express and mongoose
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection URL
const localUri = 'mongodb://localhost:27017/BlogApi'; 

// Connect to MongoDB
mongoose.connect(localUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);  // Exit if MongoDB connection fails
  });
  

// Define Schema and Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model('User', UserSchema, 'users');

// Create an Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// POST API to register a user
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const userData = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await userData.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: savedUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Define a port and start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
