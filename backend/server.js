const express = require('express');
const dotenv = require('dotenv');
const db = require('./DataBase/DB.js');

dotenv.config({ path: './config/.env' });

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;


app.get('/',(req,res)=>{
    res.send(`Hello is my server, running on : http://localhost:${port}`);
})

app.listen(port, ()=>{
    console.log(`Server is running on : http://localhost:${port}`);
})