const express = require("express");// Import Express function
const app = express();//// Call that function to create your app/server
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const db = require("./db");
app.use(express.json());
app.use('/api/auth', authRoutes);
const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);


const PORT = process.env.PORT || 5001;// Sets which port your server will listen on.
//DEBBUGGING
app.get('/', (req, res) => {
    res.send('Server is alive!');
  });

//Define a route, handle request
app.get('/jobs', async(req,res)=>{
    try{
        const result =  await db.query("SELECT * FROM jobs");
        res.json(result.rows);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Something went wrong"});
    }
    
});

//Starts your server and tells it to begin listening for requests on a port.
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    //console.log('Press Ctrl+C to stop the server');//DEBBUGGING
});





