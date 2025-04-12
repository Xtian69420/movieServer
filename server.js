require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const mongoose = require('mongoose')

app.use(cors());

// routes import
const viewsRouter = require('./routes/views')

async function connectToDatabase() {
    try {
      await mongoose.connect(process.env.DATABASE_URL);
      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
    }
  }
  
  connectToDatabase();  

const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database is running'));

app.use(express.json())

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Server is alive!' });
});

app.use('/views', viewsRouter)
app.use('/addviews', viewsRouter)
// localhos:3000/views
app.listen(3000, ()=>{
    console.log('Server is Started');
});