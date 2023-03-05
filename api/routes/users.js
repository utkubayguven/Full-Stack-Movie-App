const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const validate = require("../validateToken");

router.put("/:id", validate, async (req, res) => {

  if (req.user.id.trim() === req.params.id.trim() || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id.trim(),{$set: req.body,},{ new: true });
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account!");
  }
});

module.exports = router;


