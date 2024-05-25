const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema({
    name: String,
    username:String,
    email : {type:String , unique:true},
    mobile:Number,
    password: String,
})

const UserDeatil = mongoose.model("user", UserDetailSchema);

module.exports = UserDeatil;