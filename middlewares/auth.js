const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: "Acton is not allowed"})
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({message:"Invalid"})
        
    }
};

module.exports = authMiddleware;