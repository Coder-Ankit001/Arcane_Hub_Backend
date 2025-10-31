import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import mongoose from 'mongoose'
import User from './models/Schema.js'
import Wishlist from './models/UserWishlist.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import verifyToken from './middleware/auth.js'

await mongoose.connect(process.env.MONGO_URI)

const app = express()
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!(username && email && password)) {
            return res.status(400).send('All Fields are Required')
        }

        const userExists = await User.findOne({ email: email })
        if (userExists) {
            return res.status(409).send('User Already Exists')
        }

        const encPass = await bcrypt.hash(password, 10)

        const user = await User.create({ username, email, password: encPass })

        const token = jwt.sign(
            { user_id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        const userData = user.toObject()
        userData.token = token
        delete userData.password

        res.status(201).json(userData)
    }

    catch (err) {
        console.log(err)
        res.status(500).send("Internal Server Error")
    }

})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!(username && password)) {
            return res.status(400).send('*All Fields are Required')
        }

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(409).send('*User Doesn\'t Exist')
        }

        const check = await bcrypt.compare(password, user.password)

        if (!check) {
            return res.status(401).send('*Password is Incorrect')
        }

        const token = jwt.sign(
            { user_id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        user.token = token
        user.password = undefined

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }



        res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            user
        })
    }

    catch (err) {
        console.log(err)
        res.status(500).send("Internal Server Error!")
    }

})

app.post('/wishlist', async(req, res)=>{
    const{username, data} = req.body
    try{
        const exists = await Wishlist.findOne({username: username})
        if(!exists){
            await Wishlist.create({username: username, details: data})
            return res.status(201).send("Wishlist Created! Successfully")
        }
        await Wishlist.updateOne({username}, {$set:{details: data}})
        return res.status(200).send("Wishlist Updated! Successfully")
    }
    catch(err){
        return res.status(500).send("Internal Server Error!")
    }

})

app.post('/user', verifyToken, (req, res)=>{
    return res.status(200).send('Token is valid. Access granted to /user.')
})


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})