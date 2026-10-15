const mongoose = require('mongoose');
const TutorChat = require('../../../models/TutorChat');
const TutorProfile = require('../../../models/TutorProfile');
const { attachTooltips } = require('./segment');
const { usageOf } = require('./limits');
const { TUTOR } = require('./consts');
const { getUserPrivileges } = require('../_misc/get-user-privileges');

// every query is scoped to req.user.id: a user only ever reaches their own chats.
// The one exception: an admin may READ any chat (getChat, getAllChats); writing, deleting
// and the memory stay owner-only.

const CHAT_LIST_FIELDS = 'num title level createdAt updatedAt';

// sidebar: chats, what the tutor remembers, today's usage
async function getChats(req, res) {
  const userId = req.user.id;
  const [chats, profile, { isAdmin }] = await Promise.all([
    TutorChat.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(TUTOR.CHATS_IN_LIST)
      .select(CHAT_LIST_FIELDS)
      .lean(),
    TutorProfile.findOne({ user: userId }).select('memory level usage').lean(),
    getUserPrivileges(userId),
  ]);
  res.json({
    chats,
    memory: profile?.memory || '',
    level: profile?.level || 1,
    usage: usageOf(profile),
    isAdmin,
  });
}

async function getChat(req, res) {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ msg: 'Чат не найден' });

  const chat = await TutorChat.findById(req.params.id)
    .select(`user messages ${CHAT_LIST_FIELDS}`)
    .populate('user', 'name')
    .lean();
  if (!chat) return res.status(404).json({ msg: 'Чат не найден' });

  const isOwner = String(chat.user?._id) === String(req.user.id);
  // someone else's chat: same 404 as a missing one, unless an admin reads it
  if (!isOwner && !(await getUserPrivileges(req.user.id)).isAdmin) {
    return res.status(404).json({ msg: 'Чат не найден' });
  }

  await attachTooltips(chat.messages);
  const { user, ...rest } = chat;
  res.json(
    isOwner ? rest : { ...rest, readOnly: true, owner: { _id: user?._id, name: user?.name } },
  );
}

async function deleteChat(req, res) {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ msg: 'Чат не найден' });

  const { deletedCount } = await TutorChat.deleteOne({ _id: req.params.id, user: req.user.id });
  if (!deletedCount) return res.status(404).json({ msg: 'Чат не найден' });
  res.json({ status: 'done' });
}

// forget everything: the memory, and old chats are not summarized again
async function clearMemory(req, res) {
  const userId = req.user.id;
  await TutorProfile.updateOne(
    { user: userId },
    { $set: { memory: '', memoryUpdatedAt: new Date() } },
  );
  await TutorChat.updateMany(
    { user: userId },
    [{ $set: { summarizedCount: { $size: '$messages' } } }],
    { updatePipeline: true },
  );
  res.json({ status: 'done' });
}

// admin: latest chats of all users, to read them
async function getAllChats(req, res) {
  const chats = await TutorChat.find()
    .sort({ updatedAt: -1 })
    .limit(TUTOR.CHATS_IN_LIST)
    .select(`user ${CHAT_LIST_FIELDS}`)
    .populate('user', 'name')
    .lean();
  res.json(
    chats.map(({ user, ...chat }) => ({ ...chat, owner: { _id: user?._id, name: user?.name } })),
  );
}

module.exports = { getChats, getChat, getAllChats, deleteChat, clearMemory };
