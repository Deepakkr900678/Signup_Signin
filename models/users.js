const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    social_id: {type: Number , required: true},
    name: {type: String , required: true},
    email: {type: String , required: true},
    password: { type: String },
    login_type: {type: String , required: true},
    firebase_token: {type: String , required: true},
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;