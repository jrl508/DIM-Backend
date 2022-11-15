import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registerUser = async (req,res) => {
    console.log('REQUEST MADE:', req)
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

export const loginUser = async (req, res) => {

    const loginCredentials = req.body;

    User.findOne({ username: loginCredentials.username })
        .then( dbUser => {
                if(!dbUser) {
                    return res.status(401).json({
                        message:'Invalid Username or Password',
                        error: true
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
                                    error: false,
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