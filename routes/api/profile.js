const express = require('express'); 
const router = express.Router(); 
const auth = require('../../middleware/auth'); 
const { check, validationResult } = require('express-validator'); 

const User = require('../../models/User'); 
const Profile = require('../../models/Profile'); 



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

//Route: POST api/profile 
//Details: Create or update user profile  
//Access: Private 
router.post('/', [ auth, [
    check('status', 'Status is required').not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()
] ],
async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); 
    }
})

module.exports = router; 