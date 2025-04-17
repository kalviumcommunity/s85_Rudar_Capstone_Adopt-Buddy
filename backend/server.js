const express = require('express');
const userRouter = require('./Routes/usersapi')

const app = express();
app.use(express.json());
const port = 5000;
app.get('/',(req,res)=>{
    res.send(`Hello is my server, running on : http://localhost:${port}`);
})

app.use('/api/user',userRouter);


app.listen(port, ()=>{
    console.log(`Server is running on : http://localhost:${port}`);
})