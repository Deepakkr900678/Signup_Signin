const express = require("express");
const loginRoutes = require("./routes/login")
const userRoutes = require("./routes/user")
const postRoutes = require("./routes/posts")
const jwt = require('jsonwebtoken');
const secret = "RESTAPI";
const multer  = require('multer');
const path = require("path");
//CRUD -- CREATE, READ, UPDATE, DELETE

const app = express();

//storage engine 

const storage = multer.diskStorage({
    destination: 'upload/images',
    filename:(req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

// multer
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize:100000
    }
});

app.use('/profile', express.static('upload/images'));

app.post('/upload', upload.single('profile'), (req, res) => {
    // console.log(req.file);
    res.json({
        success: 1,
        profile_url:`http://localhost:3500/profile/${req.file.filename}`
    })
  });

app.use("/api/v1/posts", (req, res, next) => {
   
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    return res.status(401).json({
                        status: "0",
                        message: "Invalid token"
                    })
                }
                req.user = decoded.data
                next()
            })
        } else {
            return res.status(401).json({
                status: "0",
                message: "Invalid token"
            })
        }
    }
})

app.use("/api/v1", loginRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(3500, () => console.log("The server is up at 3500 port"));