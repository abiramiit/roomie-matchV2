const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const onlineUsers = new Map();
const getConversationId = (id1, id2) => [id1, id2].sort().join('_');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    onlineUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    io.emit('user:online', { userId, online: true });

    socket.on('message:send', async ({ receiverId, content }) => {
      const conversationId = getConversationId(userId, receiverId);
      const message = await Message.create({
        conversation: conversationId,
        sender: userId,
        receiver: receiverId,
        content,
      });
      await message.populate('sender', 'name avatar');
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) io.to(receiverSocket).emit('message:receive', message);
      socket.emit('message:sent', message);
    });

    socket.on('typing:start', ({ receiverId }) => {
      const s = onlineUsers.get(receiverId);
      if (s) io.to(s).emit('typing:start', { userId });
    });

    socket.on('typing:stop', ({ receiverId }) => {
      const s = onlineUsers.get(receiverId);
      if (s) io.to(s).emit('typing:stop', { userId });
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      io.emit('user:online', { userId, online: false });
    });
  });
};

module.exports = { initSocket };
