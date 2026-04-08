const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSend = require("../utils/MailUtil");
const secret = "secret";

// Capitalizes first letter of each word, lowercases the rest
const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return str;
  return str.trim().replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};


// ==========================
// REGISTER USER
// ==========================
const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await userSchema.create({
      ...req.body,
      firstName: toTitleCase(req.body.firstName),
      lastName: toTitleCase(req.body.lastName),
      phone: req.body.phone || "",
      password: hashedPassword
    });

    await mailSend(
  user.email,
  "Welcome to PG Finder 🎉",
  `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f5f2ed; padding:30px;">
    
    <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 40px rgba(26,39,68,0.08);">
      
      <!-- HEADER -->
      <div style="background:#1a2744; padding:28px; text-align:center;">
        <h1 style="margin:0; color:white; font-size:26px; letter-spacing:1px;">
          PG<span style="color:#7dd3c8;">Finder</span>
        </h1>
        <p style="margin-top:6px; color:#cbd5e1; font-size:13px;">
          Find Your Perfect Stay
        </p>
      </div>

      <!-- HERO TEXT -->
      <div style="padding:32px 28px; text-align:center;">
        <h2 style="color:#1a2744; margin-bottom:10px;">
          Welcome, ${user.firstName} 👋
        </h2>
        <p style="color:#6b7280; font-size:14px; line-height:1.6;">
          Your account has been successfully created.  
          You're now ready to explore thousands of verified PG stays across India.
        </p>

        <!-- CTA BUTTON -->
        <a href="http://localhost:5173"
           style="display:inline-block; margin-top:22px; padding:12px 26px;
           background:#1a2744; color:white; text-decoration:none;
           border-radius:10px; font-weight:600; font-size:14px;">
           🔍 Explore PGs
        </a>
      </div>

      <!-- FEATURES -->
      <div style="padding:0 28px 28px;">
        <div style="background:#f9f7f3; border-radius:12px; padding:20px; text-align:left;">
          
          <h3 style="margin-top:0; color:#1a2744; font-size:16px;">
            Why PGFinder?
          </h3>

          <ul style="padding-left:18px; color:#6b7280; font-size:14px; line-height:1.8;">
            <li>✔ Verified listings only</li>
            <li>✔ Smart filters (location, budget, amenities)</li>
            <li>✔ Secure online booking</li>
            <li>✔ Direct chat with landlords</li>
          </ul>
        </div>
      </div>

      <!-- TRUST SECTION -->
      <div style="text-align:center; padding:10px 28px 28px;">
        <p style="font-size:13px; color:#9ca3af;">
          Trusted by students & professionals across multiple cities 🇮🇳
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f1ede7; padding:18px; text-align:center;">
        <p style="margin:0; font-size:12px; color:#9ca3af;">
          © 2026 PG Finder • Made with ❤️ for better living
        </p>
      </div>

    </div>
  </div>
  `
);

    res.status(201).json({ message: "User registered", data: user });
  } catch (err) {
    res.status(500).json({ message: "Error in register" });
  }
};


// ==========================
// LOGIN USER
// ==========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ _id: user._id }, secret);
    const userData = user.toObject();
    delete userData.password;

    res.json({ message: "Login success", data: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};


// ==========================
// GET PROFILE
// ==========================
const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const user = await userSchema.findById(decoded._id).select("-password");
    res.json({ data: user });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};


// ==========================
// UPDATE PROFILE ADVANCED
// ==========================
const updateProfileAdvanced = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);

    // --- Password change flow ---
    if (req.body.currentPassword && req.body.newPassword) {
      const user = await userSchema.findById(decoded._id);

      const match = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!match) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const hashedNew = await bcrypt.hash(req.body.newPassword, 10);
      await userSchema.findByIdAndUpdate(decoded._id, { password: hashedNew });

      return res.json({ message: "Password changed successfully" });
    }

    // --- Profile info update flow ---
    const updateData = {
      firstName: toTitleCase(req.body.firstName),
      lastName: toTitleCase(req.body.lastName)
    };

    if (req.body.requestStatus) {
      updateData.status = "pending";
    }

    const updatedUser = await userSchema
      .findByIdAndUpdate(decoded._id, updateData, { new: true })
      .select("-password");

    res.json({ message: "Profile updated", data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};


// ==========================
// GET ALL USERS (ADMIN)
// ==========================
const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema
      .find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfileAdvanced,
  getAllUsers,
};