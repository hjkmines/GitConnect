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
    check('status', 'Status is required').not().isEmpty(), 
    check('skills', 'Skills is required').not().isEmpty()
] ],
async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()}); 
    }

    const {
        company, 
        website, 
        location, 
        bio, 
        status, 
        githubusername, 
        skills, 
        linkedin,
        youtube, 
        medium, 
        twitter 
    } = req.body; 

    //builds the profile object 
    const profileFields = {}; 
    profileFields.user = req.user.id; 
    if (company) profileFields.company = company; 
    if (website) profileFields.website = website; 
    if (location) profileFields.location = location; 
    if (bio) profileFields.bio = bio; 
    if (status) profileFields.status = status; 
    if (githubusername) profileFields.githubusername = githubusername; 
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim()); 
    }

    //Build social media object 
    profileFields.social = {}; 
    if (linkedin) profileFields.social.linkedin = linkedin; 
    if (youtube) profileFields.social.youtube = youtube; 
    if (medium) profileFields.social.medium = medium; 
    if (twitter) profileFields.social.twitter = twitter; 

    try {
        let profile = await Profile.findOne({user: req.user.id}); 

        if(profile) {
            //updates the profile 
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}); 

            return res.json(profile); 
        }

        //Create a new profile 
        profile = new Profile(profileFields); 
        
        await Profile.save(); 
        res.json(profile); 
    } catch(err) {
        console.error(err.message); 
        res.status(500).send('Server Error'); 
    }
})

//Route: GET api/profile 
//Details: Get all profiles  
//Access: Public 
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);  
    } catch (err) {
        console.error(err.message); 
        res.status(500).send('Server Error'); 
    }
})

//Route: GET api/profile/user/:user_id 
//Details: Get profile by user ID
//Access: Public 
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        
        if(!profile) return res.status(400).json({ msg: 'There is no profile for this user' }); 

        res.json(profile);  
    } catch (err) {
        console.error(err.message); 
        if(err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'Profile not found'})
        }

        res.status(500).send('Server Error'); 
    }
})

//Route: DELETE api/profile 
//Details: Delete profile, user and the posts   
//Access: Private 
router.delete('/', auth, async (req, res) => {
    try {
        //function: removes users posts 

        //remove user profile 
        await Profile.findOneAndRemove({user: req.user.id});
        //Removes the user 
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User deleted'});  
    } catch (err) {
        console.error(err.message); 
        res.status(500).send('Server Error'); 
    }
})

//Route: PUT api/profile/experience 
//Details: Add profile experience 
//Access: Private 
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(), 
    check('company', 'Company is required').not().isEmpty(), 
    check('from', 'From date is required').not().isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    } 

    const {
        title, 
        company, 
        location, 
        from, 
        to, 
        current, 
        description
    } = req.body; 

    const newExp = {
        title, 
        company, 
        location, 
        from, 
        to, 
        current, 
        description
    }

    try {
     const profile = await Profile.findOne({ user: req.user.id }); 

     profile.experience.unshift(newExp);
     
     await profile.save(); 

     res.json(profile); 
    } catch (err) {
        console.error(err.message); 
        res.status(500).send('Server Error')
    }
})


//Route: DELETE api/profile/experience/:exp_id 
//Details: Delete experience from profile  
//Access: Private 
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }); 

        //Get remove index 
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id); 

        profile.experience.splice(removeIndex, 1); 
        //resave below 
        await profile.save(); 

        res.json(profile); 
    } catch (err) {
        console.error(err.message); 
        res.status(500).send('Server Error')
    }
} )


module.exports = router; 