const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
const secret = "secret"
// REGISTER USER
const registerUser = async (req, res) => {

    try {

        // hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // save user
        const savedUser = await userSchema.create({
            ...req.body,
            password: hashedPassword
        })

        // send welcome email
        await mailSend(
            savedUser.email,
            "Welcome to Our App 🎉",
            `
            <div style="font-family:Arial;background:#f4f4f4;padding:30px;">
                <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden">

                    <div style="background:#4CAF50;color:white;padding:20px;text-align:center">
                        <h1>Welcome ${savedUser.firstName} ${savedUser.lastName} 🎉</h1>
                    </div>

                    <div style="padding:30px;text-align:center">
                        <h2>Thank you for registering</h2>
                        <p style="color:#555;font-size:16px">
                            We are excited to have you on our platform.
                        </p>

                        <a href="http://localhost:5173"
                        style="display:inline-block;padding:12px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;margin-top:20px">
                        Explore Now

                        
                        </a>
                    </div>

                    <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:14px">
                        <p>© 2026-27 PG Finder</p>
                    </div>

                </div>
            </div>
            `
        )

        res.status(201).json({
            message: "User created successfully",
            data: savedUser
        })

    } catch (err) {

        res.status(500).json({
            message: "Error while creating user",
            error: err
        })

    }
}


// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                message: "User account is not active"
            });
        }

        // ✅ compare password FIRST
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        // ✅ generate token AFTER validation
        const token = jwt.sign(user.toObject(), secret, { expiresIn: "1h" });

        // ✅ remove password before sending
        const userData = user.toObject();
        delete userData.password;

        // ✅ send proper response (IMPORTANT)
        return res.status(200).json({
            message: "Login Success",
            data: userData,
            token: token
        });

    } catch (err) {
        return res.status(500).json({
            message: "Login failed",
            error: err
        });
    }
};

module.exports = {
    registerUser,
    loginUser
}