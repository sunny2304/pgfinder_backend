const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/profile", UserController.getProfile);
router.put("/profile-advanced", UserController.updateProfileAdvanced);

// Admin: get all users from database with full info + createdAt
router.get("/users", UserController.getAllUsers);

module.exports = router;