const express = require('express');
const router = express.Router();
const User = require('../schema/user.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// register user page
router.post('/register', async (req, res) => {
    const {name, email, password, mobile} = req.body;
    const isUserExist = await User.findOne({email});
    if(isUserExist){
        return res.status(400).json({message: 'User already exist'});
    }

    // hasing the password using gensalt and hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

//  creating new user if user doesnot exists
    try {
        const user = User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
        });
        res.status(200).json({message: "User Created Successfully"})
    } catch (error) {
        res.status(500).json({message: "Error in creating user"})  
    }
});

//  login page
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: 'Wrong username or password'});
    }

    // comparing the registered user password and login user password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: 'Wrong username or password'});
    }
    // accessing id from the user as a payload which used in token renerate
    const payLoad = {
        id: user._id,
    }
    //  generating jsonwebtokens (tokens)
    const token = jwt.sign(payLoad, process.env.SECRET_JWT ,{
        expiresIn: '1h',
    });
    res.status(200).json({token})
})
module.exports = router;