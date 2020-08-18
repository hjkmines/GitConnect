const express = require('express'); 
const router = express.Router(); 

//Route: GET api/posts
//Details: Test route 
//Access: Public 
router.get('/', (req, res) => res.send('Hello')); 

module.exports = router; 