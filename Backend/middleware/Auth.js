const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken=(req,res,next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).send("Request denied");
    try{
       const verifed=jwt.verify(token,process.env.JWT_SECRET);
       req.user=verifed;
       next();
    }
    catch(error){
      res.status(400).send("Invalid token");
    }
  }


module.exports = verifyToken;
