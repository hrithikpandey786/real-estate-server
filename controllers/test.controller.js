const jwt = require("jsonwebtoken");

const shouldBeLoggedIn = (req, res)=>{
        
        res.status(200).json({message: "You are authenticated"});
    
}

const shouldBeAdmin = (req, res)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Not Authenticated"});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload)=>{
        if(err){
            return res.status(403).json({message: "Token is not valid"});
        }
        
        if(!payload.isAdmin){
            return res.status(200).json({message: "You are Not Authorized"});
        }

        return res.status(403).json({message: "You are Authenticated"});
    })
}

module.exports =  {shouldBeLoggedIn, shouldBeAdmin};