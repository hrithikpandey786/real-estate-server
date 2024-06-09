const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const register = async (req, res)=>{
    try{
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newData = await prisma.user.create({
            data:{
                username,
                email,
                password: hashedPassword
            }
        })

        res.status(201).json(newData);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to create user"});
    }
}

const login = async (req, res)=>{
    const {username, password} = req.body;
    try{

        const user = await prisma.user.findUnique({
            where: {username}
        });
        
        if(!user){
            return res.status(401).json({message: "Invalid Credentials!"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid Credentials!"});
        }
        
        const age = 1000*60*60*24*7;

        const token = jwt.sign({
            id: user.id,
            isAdmin: false,
        }, process.env.JWT_SECRET_KEY, {expiresIn: age});

        return res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
            // secure: true
        }).status(200).json(user);

    } catch(err){
        res.status(500).json({message: "Failed to login"});
    }
}

const logout = (req, res)=>{
    const token = req.cookies;
    
    try{
        return res.clearCookie("token").status(200).json({message: "deleted"});
    } catch(err){
        console.log(err);
    }
}

module.exports = {register, login, logout};