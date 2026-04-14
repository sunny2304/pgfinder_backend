const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile", UserController.getProfile);
router.put("/profile-advanced", UserController.updateProfileAdvanced);

// Admin: get all users
router.get("/users", UserController.getAllUsers);

// Forgot / Reset password
router.post("/forgotpassword", UserController.forgotPassword);
router.put("/resetpassword", UserController.resetPassword);

module.exports = router;