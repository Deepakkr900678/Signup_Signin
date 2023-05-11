const express = require("express")
const router = express.Router();
const User = require("../models/users")
const jwt = require("jsonwebtoken");
const secret = "RESTAPI";

router.post("/posts", async (req, res)=>{
  
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, secret);
    const userId = decodedToken.data;
    const user = await User.findOne({ _id: userId });
    res.json({
        status:"1",
        message:"Valid User",
        data: user
    })
})

module.exports = router;