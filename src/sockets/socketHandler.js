const { verifyToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function initializeSocket(io) {
  // Socket.io authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.email} (${socket.user.role})`);

    // Join role-based rooms for targeted messaging
    socket.join(socket.user.role);
    socket.join(`user-${socket.user.id}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.email}`);
    });

    // Handle custom events if needed
    socket.on('ping', () => {
      socket.emit('pong', { message: 'Server is alive', timestamp: new Date() });
    });
  });

  return io;
}

module.exports = initializeSocket;

