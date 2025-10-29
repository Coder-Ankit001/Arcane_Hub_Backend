import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers['authorization']
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).send('Access Denied! No Token Provided.')
    }

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).send('Invalid or expired token.');
    }
}
export default verifyToken