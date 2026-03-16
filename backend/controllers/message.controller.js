const Message = require("../models/Message");

// ── POST /messages/send ───────────────────────────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text?.trim()) {
      return res.status(400).json({ message: "senderId, receiverId and text are required" });
    }

    // Prevent messaging yourself
    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    // Ensure the JWT user can only send as themselves
    if (req.userId !== senderId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const message = await Message.create({
      sender:   senderId,
      receiver: receiverId,
      text:     text.trim(),
    });

    res.status(201).json({ message: "Message sent", data: message });
  } catch (err) {
    next(err);
  }
};

// ── GET /messages/chat/:otherUserId/:myUserId ─────────────────────────────────
const getConversation = async (req, res, next) => {
  try {
    const { otherUserId, myUserId } = req.params;

    // Ensure the JWT user can only read their own conversation
    if (req.userId !== myUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mark incoming messages as seen
    await Message.updateMany(
      { sender: otherUserId, receiver: myUserId, seen: false },
      { seen: true }
    );

    const messages = await Message.find({
      $or: [
        { sender: myUserId,    receiver: otherUserId },
        { sender: otherUserId, receiver: myUserId    },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// ── GET /messages/inbox/:userId ───────────────────────────────────────────────
const getInbox = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Sort newest first — first encounter per conversation = most recent message
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender",   "name")
      .populate("receiver", "name");

    const conversations = {};

    for (const msg of messages) {
      const otherUser =
        msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      const otherId = otherUser._id.toString();

      if (!conversations[otherId]) {
        // First encounter is always the latest message — set it once, never overwrite
        conversations[otherId] = {
          userId:      otherId,
          name:        otherUser.name,
          lastMessage: msg.text,
          time:        msg.createdAt,
          hasUnread:   false,
        };
      }

      if (msg.receiver._id.toString() === userId && !msg.seen) {
        conversations[otherId].hasUnread = true;
      }
    }

    res.json(Object.values(conversations));
  } catch (err) {
    next(err);
  }
};

// ── GET /messages/unread-count/:userId ────────────────────────────────────────
const getUnreadCount = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const count = await Message.countDocuments({ receiver: userId, seen: false });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, getConversation, getInbox, getUnreadCount };