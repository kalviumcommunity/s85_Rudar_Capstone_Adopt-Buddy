const express = require('express');
const dotenv = require('dotenv');
const db = require('./DataBase/DB.js');

dotenv.config({ path: "./config/.env" });

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

const UserAPI = require('./Routes/UserAPI');
app.use('/api/users',UserAPI);

const petAPI = require('./Routes/petAPI');
app.use('/api/pet',petAPI);

const ShelterAPI = require('./Routes/ShelterAPI');
app.use('/api/shelter',ShelterAPI);

const AdoptionRequestAPI = require('./Routes/AdoptionRequestAPI');
app.use('/api/request',AdoptionRequestAPI);

app.get('/',(req,res)=>{
    res.send(`Hello is my server, running on : http://localhost:${port}`);
})

app.listen(port, ()=>{
    console.log(`Server is running on : http://localhost:${port}`);
})