const express = require("express")
const router = express.Router();

const bodyParser = require('body-parser')
router.use(bodyParser.json())

const User = require("../models/users")

//READ OPERATION for all the users.
router.get("/users", async (req, res) => {
    try {
        //write the code to fetch all the users
        const users = await User.find();
        res.status(200).json({
            status: "1",
            data: users
        })

    } catch (e) {
        res.status(404).json({
            status: "0",
            message: e.message
        });
    }
})

router.get("*", (req, res) => {
    res.status(404).json({
        status: "0",
        message: "Invalid Request"
    });
})

module.exports = router;