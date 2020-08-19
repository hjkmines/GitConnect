const express = require('express');
const router = express.Router(); 

//ROUTE: POST api/users 
//DETAILS: Registers the user  
//Access: PUBLIC 
router.post('/', (req, res) => {
    console.log(req.body); 
    res.send('User Route'); 
});

module.exports = router; 