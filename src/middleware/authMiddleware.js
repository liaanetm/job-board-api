// Import jsonwebtoken library to verify and decode JWTs (JSON Web Tokens)
const jwt = require('jsonwebtoken');

// Authentication middleware function
// This function ensures that only requests with a valid token can access protected routes
const auth = (req, res, next)=>{
    // Extract the Authorization header from the incoming request
    // The convention is: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    // If the Authorization header is missing or doesn't start with "Bearer"
    // deny access immediately
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ message: 'Authorization denied: No token provided' });
    }
    
    // Split "Bearer <token>" by space and take the token part (index 1)
    const token = authHeader.split(' ')[1];
    try {
        // Verify and decode the token using the secret stored in environment variables
        // If valid, decoded will contain the payload we set during login (e.g., { userId, email })
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach decoded user info to the request object
        // Now, in protected routes, you can access `req.user` to know who made the request
        req.user = decoded; // { userId, email }
        console.log('Decoded JWT:', decoded);//DEBUGGING
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Authorization denied: Invalid token' });
    }
    
};
module.exports = auth;