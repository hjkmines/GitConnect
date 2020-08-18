const express = require('express');
const router = express.Router(); 

//ROUTE: GET api/users 
//DETAILS: Test Route 
//Access: PUBLIC 
router.get('/', (req, res) => res.send('User route'));

module.exports = router; 