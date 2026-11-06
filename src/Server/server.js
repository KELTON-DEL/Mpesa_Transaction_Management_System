const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const User=require('./models/dbModel');
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");


require("dotenv").config();

//initialising your app to express
const app=express();
app.use(express.json());
app.use(cors())

//getting secret keys from the env file 
const port=process.env.PORT;

//register route
app.post('/register',async(req,res)=>{
  
  // 1. Check how many users currently exist in the database
        const userCount = await User.countDocuments();

        if (userCount >= 2) {
            return res.status(403).json({ 
                success: false, 
                message: "Maximum user limit has been reached." 
            });
   
        
        }

  const {username,email,password}=req.body;
  bcrypt.hash(password,10) 
  .then(hash=>{
   User.create({username,email,password:hash})
  .then((data)=>{
    if(data){
    res.json("oky")
    console.log("data submited succefully",data)
    }
  })

  .catch((err)=>{
    res.json(err)
    console.log(err.message)
  })
    
  })
 
})





// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});



// Verify logged-in user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token"
      });
    }

    req.userId = decoded.userId;
    next();
  });
};


// GET logged-in user's profile
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: "Could not retrieve profile"
    });
  }
});


// UPDATE logged-in user's profile
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        message: "Username and email are required"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.userId }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already being used"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || ""
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Profile update error:", err);

    res.status(500).json({
      message: "Failed to update profile"
    });
  }
});



// CHANGE PASSWORD
app.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide your current and new passwords."
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must have at least 8 characters."
      });
    }

    // Find the logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Your current password is incorrect."
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save the new password in MongoDB
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. You can now log in using your new password."
    });

  } catch (err) {
    console.error("Change password error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to change password."
    });
  }
});


//Listening to the server
app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})

//creating db connection with mongoose

mongoose.connect(process.env.CONN_STRING)
.then(()=>{
    console.log("database connected succefully...")
})
.catch((err)=>{   
    console.log("database connection failed: " ,err.message) 
})