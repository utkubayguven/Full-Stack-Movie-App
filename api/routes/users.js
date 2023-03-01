const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const validate = require("../validateToken")

router.put("/:id",validate,async(req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY)
        }

        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set: req.body})
            res.status(200).json(updatedUser)
        }catch(err){
            res.status.json(err)
        }
    }else{
        res.status.json(403).json("You are not admin")
    }
})


module.exports = router