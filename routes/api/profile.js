const express = require('express'); 
const router = express.Router(); 
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Profile = require('../../models/Profile')


//Route: GET api/profile/me 
//Details: Get current users profiles 
//Access: Private 
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await (await Profile.findOne({user: req.user.id})).populated('user', 
        ['name', 'avatar']); 

        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'}); 
        }

        res.json(profile); 
    } catch(err) {
        console.error(err.message); 
        res.status(500).send('Server Error')
    }
}); 

module.exports = router; 