import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import User from "../models/user.js";
const saltrounds = 10;

export const register = async (req,res) => {
    try{
        const emailcheck=req.body.email;
        const found = await User.findOne({email:emailcheck});

        if(found) return res.status(400).json({ msg : "User already exists."});
        
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
    }=req.body;


    bcrypt.hash(password, saltrounds , async (err, hash) => {            // Helps to hash password 

        if (err) {
            res.status(401).json({ msg: "Error" });       // If any error then send error
        }
    
        const newUser = new User({
            firstName,
            lastName,
            email,
            password:hash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile:Math.floor(Math.random()*1000),
            impressions:Math.floor(Math.random()*1000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); 
        }
    )
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}

export const login = async (req,res) => {
    try{
        const { email,password } = req.body;
        const user = await User.findOne ( {email:email});

        if(!user) return res.status(400).json({ msg : "User doesn't exist"});

        const ismatch = await bcrypt.compare(password,user.password);

        if(!ismatch) return res.status(400).json({ msg : "Invalid credentials"});

        const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET);

        delete user.password;
        res.status(200).json({ token , user});
    }
    catch(err) {
        res.status(500).json({msg : err.message});
    }
}
