const express = require('express');
const dotenv = require('dotenv');
const db = require('./DataBase/DB.js');
const cors = require('cors');
dotenv.config({ path: "./config/.env" });

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;
app.use(cors());
// Connect to Database
// db(); // Make sure this function connects to MongoDB properly

// Routes
const UserAPI = require('./Routes/UserAPI');
app.use('/api/users', UserAPI); // /sign-up, /users, /users/:id

const PetAPI = require('./Routes/petAPI');
app.use('/api/pet', PetAPI); // /addpet, /pets, /pets/:id

const ShelterAPI = require('./Routes/ShelterAPI');
app.use('/api/shelter', ShelterAPI); // /addshelter, /shelters, /shelters/:id

const AdoptionRequestAPI = require('./Routes/AdoptionRequestAPI');
app.use('/api/request', AdoptionRequestAPI); // /newRequest, /requests, /requests/:id

// Default Route
app.get('/', (req, res) => {
    res.send(`🚀 AdoptBuddy Server is running at: http://localhost:${port}`);
});

// Start Server
app.listen(port, () => {
    console.log(`✅ Server is running on: http://localhost:${port}`);
});
