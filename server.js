const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect('mongodb+srv://rs6402278:xHcdfmJlelDqurDP@jobsocialcluster1.8vtkp.mongodb.net/?retryWrites=true&w=majority&appName=JobSocialCluster1', {
  // Remove deprecated options
});

// Define user schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  countryCode: String,
  phoneNumber: String,
  preferences: {
    moveInTime: String,
    lookingFor: [String], // Changed to array
    roomType: [String], // Changed to array
    locations: [String],
    preferences: [String]
  }
});

const User = mongoose.model('User', userSchema);

// API endpoint for user signup
app.post('/api/signup', async (req, res) => {
  try {
    const { firstName, lastName, countryCode, phoneNumber, preferences } = req.body;
    const newUser = new User({ firstName, lastName, countryCode, phoneNumber, preferences });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    const { countryCode, phoneNumber } = req.body;
    const user = await User.findOne({ countryCode, phoneNumber });
    
    if (user) {
      res.status(200).json({
        message: 'Login successful',
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          preferences: user.preferences
        }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// API endpoint to update user preferences
app.post('/api/update-preferences', async (req, res) => {
  try {
    const { countryCode, phoneNumber, preferences } = req.body;
    const user = await User.findOneAndUpdate(
      { countryCode, phoneNumber },
      { $set: { preferences: preferences } },
      { new: true }
    );
    
    if (user) {
      res.status(200).json({ message: 'Preferences updated successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Onboarding.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//enter the command in the terminal that node server.js 
//go to http://localhost:3000/ for running of the app