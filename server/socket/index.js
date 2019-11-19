module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    // NOTE: a socket CAN be part of more than 1 room
    socket.on('join', function(room) {
      socket.join(room);
      // console.log(room);
      // console.log(io.sockets.adapter.rooms[room].sockets);
    });

    socket.on('leave', function(room) {
      socket.leave(room);
    });

    // tells you which sockets exist in a given room
    // console.log(io.sockets.adapter.rooms[room].sockets);

    // each socket enters a room identified by its socketId by default

    socket.on('board-change', (room, data) => {
      socket.broadcast.to(room).emit('board-change', data);
    });

    socket.on('modify', (room, data) => {
      socket.broadcast.to(room).emit('modify', data);
    });

    socket.on('new user', room => {
      socket.broadcast.to(room).emit('new user');
    });

    socket.on('new ticket', (room, ticket) => {
      socket.broadcast.to(room).emit('new ticket', ticket);
    });

    socket.on('remove ticket', (room, ticket) => {
      socket.broadcast.to(room).emit('remove ticket', ticket);
    });

    socket.on('update ticket', (room, ticket) => {
      socket.broadcast.to(room).emit('update ticket', ticket);
    });

    socket.on('reorder', (room, columns) => {
      socket.broadcast.to(room).emit('reorder', columns);
    });

    socket.on('new column', (room, column) => {
      socket.broadcast.to(room).emit('new column', column);
    });

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};
