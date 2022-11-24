import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registerUser = async (req,res) => {
    const user = req.body;
    // check if credentials already exists
    const takenUsername = await User.findOne({username: user.username.toLowerCase()})
    const takenEmail = await User.findOne({email: user.email.toLowerCase()})

    if(takenUsername || takenEmail) {
        res.status(409).json({error: 'Username or email are already in use'})
    } else {
        const hashword = await bcrypt.hash(user.password, 10);

        const dbUser = new User({
            username: user.username.toLowerCase(),
            email: user.email.toLowerCase(),
            password: hashword,
        })

        dbUser.save();
        res.status(201).json({message:'User successfully registered'})
    }
}

export const loginUser = async (req, res) => {

    const loginCredentials = req.body;

    User.findOne({ username: loginCredentials.username })
        .then( dbUser => {
                if(!dbUser) {
                    return res.status(401).json({
                        error:'Invalid Username or Password',
                    })
                }
                bcrypt.compare(loginCredentials.password, dbUser.password)
                .then(isCorrect => {
                    if (isCorrect) {
                        const payload = {
                            id: dbUser._id,
                            username: dbUser.username
                        }
                        jwt.sign(
                            payload,
                            process.env.JWT_SECRET,
                            {expiresIn: 86400},
                            (err, token) => {
                                if(err) {
                                    return res.json({message: err})
                                }
                                return res.json({
                                    message: "Success",
                                    token: `Bearer ${token}`, 
                                    error: null,
                                    id: dbUser._id,
                                    username: dbUser.username,
                                    email: dbUser.email
                                })
                            }
                            )
                    } else {
                        return res.status(401).json({
                            error:'Invalid Username or Password',  
                        })
                    }

                })
            }
        )
}