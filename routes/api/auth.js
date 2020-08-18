const express = require('express'); 
const router = express.Router(); 

//Route: GET api/users 
//Details: Test route 
//Access: Private 
router.get('/', (req, res) => res.send('Test'))

module.exports = router; 