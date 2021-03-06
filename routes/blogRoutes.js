const express = require("express");
const blogController = require("../controllers/blogControllers");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/create", requireAuth, blogController.blog_create_get);
router.post("/", blogController.blog_create_post);
router.get("/:id", blogController.blog_details);
router.delete("/:id", blogController.blog_delete);

module.exports = router;
