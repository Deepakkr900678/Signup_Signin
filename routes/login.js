const express = require("express")
const bodyParser = require('body-parser')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/users")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secret = "RESTAPI";

router.use(bodyParser.json())

router.post("/register",
    body('social_id').isNumeric(),
    body('name').isAlpha(),
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 16 }),
    body('login_type').isAlpha(),
    body('firebase_token').isAlphanumeric(),
    async (req, res) => {

        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { social_id, name, email, password, login_type, firebase_token } = req.body;

            let user = await User.findOne({ email });
            //Check wheather user is already registered
            if (user) {
                return res.status(401).json({
                    status: "0",
                    message: "Email already exists"
                });
            }

            bcrypt.hash(password, 10, async function (err, hash) {

                if (err) {
                    return res.status(400).json({
                        status: "0",
                        message: err.message
                    });
                }

                const user = await User.create({
                    social_id,
                    name,
                    email,
                    login_type,
                    firebase_token,
                    password: hash
                })
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                }, secret);
                return res.json({
                    status: "1",
                    message: "Registration successful",
                    user,
                    token
                })
            })
        } catch (e) {
            res.status(500).json({
                status: "0",
                message: e.message
            })
        }

    })

//Login the users.

router.post("/login",
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 16 }),
    async (req, res) => {

        try {
            //Finds the validation errors in this request and wraps them in an object with handy functions.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Please enter your email first"
                })
            }
            const { email, password } = req.body;

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    status: "0",
                    message: "User doesnt exist"
                });
            }


            //Load hash from your passowrd DB
            // Compare the password with hash password.
            bcrypt.compare(password, user.password, function (err, result) {
                //Result === true
                if (err) {
                    return res.status(500).json({
                        status: "0",
                        message: "Password is incorrect please check your password"
                    });
                }
                if (result) {
                    // Token will be used to track the user for further operation
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id
                    }, secret);


                    res.status(200).json({
                        status: "1",
                        message: "Login Successfully",
                        user,
                        token,
                    });

                } else {
                    res.status(401).json({
                        status: "0",
                        message: "Invalid Credentials !! Please provide correct email and password"
                    });
                }
            })
        } catch (e) {
            res.status(401).json({
                status: "1",
                message: "Email and Password both are incorrect please check"
            })
        }
    })

router.get("/register", (req, res) => {
    res.send("OK")
})

module.exports = router;