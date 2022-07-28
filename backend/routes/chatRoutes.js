const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controller/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);  // create/access one to one Chats
router.route("/").get(protect, fetchChats);  // Find the all existing chats of currently logged user
router.route("/group").post(protect, createGroupChat);  
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;