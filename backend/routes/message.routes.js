const express = require("express");
const router  = express.Router();

const { sendMessage, getConversation, getInbox, getUnreadCount } = require("../controllers/message.controller");
const { protect }       = require("../middleware/auth.middleware");
const { searchLimiter } = require("../middleware/rateLimit.middleware");

router.post("/send",                           protect, searchLimiter, sendMessage);
router.get("/chat/:otherUserId/:myUserId",     protect, searchLimiter, getConversation);
router.get("/inbox/:userId",                   protect, searchLimiter, getInbox);
router.get("/unread-count/:userId",            protect, searchLimiter, getUnreadCount);

module.exports = router;