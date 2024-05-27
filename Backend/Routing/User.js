const UserSchema = require("../Schema/UserSchema")
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/Auth")

router.post("/signup",async(req,res)=>{
    const { name, username, email, mobile, password } = req.body;

    if (!name || !username || !email || !mobile || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the user already exists
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserSchema({
            name,
            username,
            email,
            mobile,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 }); // 1 hour

        
        res.status(200).json({ message: "Login successful", token});
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/update", middleware, async (req, res) => {
    const { name, username, email, mobile } = req.body;

    const userId = req.user.id


    if (!name || !username || !email || !mobile) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await UserSchema.findByIdAndUpdate(userId,{ name, username, email, mobile }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/delete", middleware, async (req, res) => {

    const userId = req.user.id

    try {
        const user = await UserSchema.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/details", middleware, async (req, res) => {
    const userId = req.user.id;
  
    try {
      const user = await UserSchema.findById(userId, 'name username email mobile joined');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  


module.exports = router;