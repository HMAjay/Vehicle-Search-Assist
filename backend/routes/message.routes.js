const express = require("express");
const router  = express.Router();

const { sendMessage, getConversation, getInbox, getUnreadCount } = require("../controllers/message.controller");
const { protect }       = require("../middleware/auth.middleware");

router.post("/send",                           protect, sendMessage);
router.get("/chat/:otherUserId/:myUserId",     protect, getConversation);
router.get("/inbox/:userId",                   protect, getInbox);
router.get("/unread-count/:userId",            protect, getUnreadCount);

module.exports = router;