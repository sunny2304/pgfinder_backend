const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSend = require("../utils/MailUtil");
const secret = "secret";


// ==========================
// REGISTER USER
// ==========================
const registerUser = async (req, res) => {
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // save user
    const user = await userSchema.create({
      ...req.body,
      password: hashedPassword
    });

    // send welcome mail (NEW THEME)
    await mailSend(
      user.email,
      "Welcome to PG Finder 🎉",
      `
      <div style="font-family:Arial, sans-serif; background:#f5f7fb; padding:30px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">

          <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
            <h1 style="margin:0;">PG Finder</h1>
            <p style="margin:5px 0 0;">Find Your Perfect Stay</p>
          </div>

          <div style="padding:30px; text-align:center;">
            <h2>Welcome, ${user.firstName} 👋</h2>

            <p style="color:#555;">
              Your account has been created successfully.
              Start exploring PGs now.
            </p>

            <a href="http://localhost:5173"
               style="display:inline-block; margin-top:20px; padding:12px 20px;
               background:#2563eb; color:white; text-decoration:none;
               border-radius:6px;">
               Explore Now
            </a>
          </div>

          <div style="background:#f1f5f9; padding:15px; text-align:center; font-size:13px; color:#777;">
            © 2026 PG Finder
          </div>

        </div>
      </div>
      `
    );

    res.status(201).json({
      message: "User registered",
      data: user
    });

  } catch (err) {
    res.status(500).json({
      message: "Error in register"
    });
  }
};


// ==========================
// LOGIN USER
// ==========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ _id: user._id }, secret);

    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Login success",
      data: userData,
      token
    });

  } catch (err) {
    res.status(500).json({
      message: "Login error"
    });
  }
};


// ==========================
// GET PROFILE
// ==========================
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    const user = await userSchema
      .findById(decoded._id)
      .select("-password");

    res.json({
      data: user
    });

  } catch (err) {
    res.status(401).json({
      message: "Unauthorized"
    });
  }
};

const updateProfileAdvanced = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);

    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName
    };

    // handle status request
    if (req.body.requestStatus) {
      updateData.status = "pending"; // waiting for admin approval
    }

    const updatedUser = await userSchema.findByIdAndUpdate(
      decoded._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      data: updatedUser
    });

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfileAdvanced
};