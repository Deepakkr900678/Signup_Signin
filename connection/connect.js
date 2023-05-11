const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://node12345:node12345@cluster0.cilg4fh.mongodb.net/node?retryWrites=true&w=majority')
.then(console.log("Login Successful"))
.catch(console.error)