const express = require("express");// Import Express function
const app = express();//// Call that function to create your app/server

const PORT = process.env.PORT || 3000;// Sets which port your server will listen on.

//Define a route, handle request
app.get('/',(req,res)=>{
    res.send("Hello from the Express server!");
});

//Starts your server and tells it to begin listening for requests on a port.
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

