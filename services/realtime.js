const { Server } = require('socket.io');

function setupRealTime(httpServer) {
  const io = new Server(httpServer);
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_project', (projectId) => {
      try {
        socket.join(projectId);
        socket.broadcast.to(projectId).emit('user_joined', socket.id);
      } catch (error) {
        console.error('Error joining project:', error);
      }
    });

    socket.on('design_update', (projectId, update) => {
      try {
        io.to(projectId).emit('design_update', update);
      } catch (error) {
        console.error('Error sending design update:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  return io;
}

module.exports = { setupRealTime };
