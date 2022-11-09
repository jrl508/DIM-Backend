import mongoose from 'mongoose';
import User from '../models/user.model.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registerUser = async (req,res) => {
    const user = req.body;

    // check if credentials already exists
    const takenUsername = await User.findOne({username: user.username})
    const takenEmail = await User.findOne({email: user.email})

    if(takenUsername || takenEmail) {
        res.json({message: 'Username or email are already in use'})
    } else {
        const hashword = await bcrypt.hash(user.password, 10);

        const dbUser = new User({
            username: user.username.toLowerCase(),
            email: user.email.toLowerCase(),
            password: hashword,
        })

        dbUser.save();
        res.json({message:'User successfully registered'})
    }

}