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


router.delete("/:id", validate, async (req, res) => {

  if (req.user.id.trim() === req.params.id.trim() || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id.trim());
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your account!");
  }
});

router.get("/find/:id", async (req, res) => {

  try {
    const user = await User.findById(req.params.id.trim());
    const {password , ...info} = user._doc
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
  
});


router.get("/", validate, async (req, res) => {
  const query = req.query.new
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(10) : await User.find()
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err); 
    }
  } else {
    res.status(403).json("You are not allowed to see all users");
  }
});


router.get('/stats', async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.getFullYear() - 1);

  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(lastYear) }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;


