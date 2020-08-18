const express = require('express'); 
const router = express.Router(); 

//Route: GET api/profile 
//Details: Test route 
//Access: Public 
router.get('/', (req, res) => res.send('Hello')); 

module.exports = router; 