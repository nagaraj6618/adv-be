const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { getAllQuestionData, addNewQuestion, deleteQuestionById } = require('./controller/questionController');


const port = 8088;
const app = express();
const MONGODB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

function dbConnection () {
   mongoose.connect(MONGODB_URL)
   .then(()=> console.log('DB Connected'))
   .catch((error)=>console.log('DB not connected:',error));
}
dbConnection();
app.get('/api/v1',(req,res) => {
   res.status(200).json({
      message:"Working.."
   })
})

app.get('/api/v1/question',getAllQuestionData)
app.post('/api/v1/question' ,addNewQuestion);
app.delete('/api/v1/question/:id',deleteQuestionById);


app.listen(port,() => console.log("Server started..."))