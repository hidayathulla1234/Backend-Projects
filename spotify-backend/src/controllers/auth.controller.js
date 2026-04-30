const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// register a new user
async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // generate JWT token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//LOGIN USER


async function LoginUser(req,res){
    try {
        const {email,password}=req.body;

       //check if user exists 
        const user=await User.findOne({email});
        if(!user){
            return res.status(409).json({
                message:"User not found"
            });
        }
       //check if password is correct 
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(409).json({
                message: "Invalid password"
            });
        }
    
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}    
        );
        res.status(200).json({
            message:"User logged in successfully",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = { registerUser, LoginUser };