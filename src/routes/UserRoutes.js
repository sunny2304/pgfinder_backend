const router = require("express").Router()
const UserController = require("../controllers/UserController")
router.post("/register",UserController.registerUser)
router.post("/login",UserController.loginUser)
router.get("/profile",UserController.getProfile)
router.put("/profile-advanced", UserController.updateProfileAdvanced);
module.exports = router