const express = require('express');
const router = express.Router(); 
const { check, validationResult } = require('express-validator/check')

//ROUTE: POST api/users 
//DETAILS: Registers the user  
//Access: PUBLIC 
router.post('/', [
    //validators using the express validator for the name, email, and password 
    check('name', 'Please enter a name').not().isEmpty(), 
    check('email', 'Email is required').isEmail(), 
    check('password', 'Enter a password that is 8 or more characters').isLength({min: 8})
], (req, res) => {
    //catch the errors and respond with a message with a 400 client bad request, else return normal response. 
    const errors = validationResult(req); 

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }

    res.send('User Route'); 
});

module.exports = router; 