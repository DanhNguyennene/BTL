const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    console.log('All Headers:', req.headers);
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        })
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).json({
            success:false,
            message: "Invalid token"
        })
    }
}


const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user){
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }
        if (!allowedRoles.includes(req.user.user_type)){
            return res.status(403).json({
                success:false,
                message: "Access Denied. Insufficient permission!"
            });
        }
        next();
    }
}

module.exports = { verifyToken, authorizeRole };

