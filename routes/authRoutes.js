const { Router } = require("express");
const authController = require("../controllers/authControllers");

const router = Router();

router.get("/sign-up", authController.signup_get);
router.post("/sign-up", authController.signup_post);
router.get("/log-in", authController.login_get);
router.post("/log-in", authController.login_post);
router.get("/log-out", authController.logout_get);

module.exports = router;
