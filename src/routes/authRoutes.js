const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/authController");

//DEBBUGING
/*router.post('/register', (req, res) => {
    res.status(200).json({ message: 'Register route works!' });
  });*/
  

router.post('/register', register);
router.post('/login', login);

module.exports = router;