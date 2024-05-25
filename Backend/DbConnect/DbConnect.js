const mongoose = require("mongoose");
require('dotenv').config();
const Db = process.env.DB_URL;

async function connectDb() {
    try{
        await mongoose.connect(Db);
        console.log("Db connected successfully...");
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDb;