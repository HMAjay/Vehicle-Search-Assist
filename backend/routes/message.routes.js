const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getConversation,
  getInbox,
  getUnreadCount,
} = require("../controllers/message.controller");
const { protect } = require("../middleware/auth.middleware");
const { searchLimiter } = require("../middleware/rateLimit.middleware");

router.post("/send", searchLimiter, protect, sendMessage);
router.get(
  "/chat/:otherUserId/:myUserId",
  searchLimiter,
  protect,
  getConversation,
);
router.get("/inbox/:userId", searchLimiter, protect, getInbox);
router.get("/unread-count/:userId", searchLimiter, protect, getUnreadCount);

module.exports = router;
