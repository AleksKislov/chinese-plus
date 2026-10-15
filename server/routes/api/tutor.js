const router = require('express').Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/admin-auth');

const {
  sendMessage,
  getChats,
  getChat,
  getAllChats,
  deleteChat,
  clearMemory,
} = require('../../src/api/services/tutor');

/**
 * @route     GET api/tutor/chats
 * @desc      User's AI tutor chats (titles only), memory and today's usage
 * @access    Private
 */
router.get('/chats', auth, getChats);

/**
 * @route     GET api/tutor/all-chats
 * @desc      Latest chats of all users (titles and owners), to read them
 * @access    Admin
 */
router.get('/all-chats', adminAuth, getAllChats);

/**
 * @route     GET api/tutor/chats/:id
 * @desc      One chat with messages; assistant blocks carry word tooltips.
 *            Admins may read other users' chats (readOnly: true, owner)
 * @access    Private
 */
router.get('/chats/:id', auth, getChat);

/**
 * @route     DELETE api/tutor/chats/:id
 * @desc      Delete one of the user's chats
 * @access    Private
 */
router.delete('/chats/:id', auth, deleteChat);

/**
 * @route     POST api/tutor/messages
 * @desc      Send a message ({ text, level, chatId? }) and get the tutor's reply;
 *            without chatId a new chat is created
 * @access    Private
 */
router.post('/messages', auth, sendMessage);

/**
 * @route     DELETE api/tutor/memory
 * @desc      Forget what the tutor remembers about the user
 * @access    Private
 */
router.delete('/memory', auth, clearMemory);

module.exports = router;
