const express = require('express');
const Dbconnect = require("./DbConnect/DbConnect")
Dbconnect();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const userRoutes = require("./Routing/User");
const PostRoutes = require("./Routing/PostItem");
const like = require("./Routing/Likes")
const reply = require("./Routing/Replys")

const app = express();
app.use(express.json());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const cors = require("cors");

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL without trailing slash
  credentials: true // Allow cookies to be sent
};

app.use(cors(corsOptions));


app.use("/user", userRoutes);
app.use("/item", PostRoutes);
app.use("/like",like);
app.use("/reply",reply);


const port = process.env.PORT


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
