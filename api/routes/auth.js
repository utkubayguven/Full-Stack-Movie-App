const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

router.post("/register",async (req,res)=>{
    const newUser =  new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY)
    })
    try{
        const user =await newUser.save();
        res.status(201).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})

router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({email : req.body.email})
        if (!user) {
            return res.status(401).json("Wrong password or username!");
        }

        const decrypted =  CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const password2 = decrypted.toString(CryptoJS.enc.Utf8);

        if (password2 !== req.body.password) {
            return res.status(401).json("Wrong password or username!");
        }

        const accToken = jwt.sign({id : user._id , isAdmin : user.isAdmin},process.env.SECRET_KEY,{expiresIn : "10d"})

        const { password , ...user2} = user._doc ;
        res.status(200).json({...user2,accToken});
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router