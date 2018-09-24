'use strict';

const _ = require('lodash');

module.exports.SocketProcessor = class {

  constructor(io, conversationStore, userStore) {
    this.io = io;
    this.conversationStore = conversationStore;
    this.userStore = userStore;
    this.socketMap = new Map();
  }

  broadcastInfoAboutNewUser(socket, username) {
    const data = this.userStore.users.get(username);
    socket.broadcast.emit('newUser', {
      username,
      photo: data.photo
    });
  }

  process(socket) {
    if (!_.has(socket, 'handshake.session.username')) {
      console.warn('Attempting to open a socket without selecting a username');
      socket.disconnect();
      return;
    }
    this.socketMap.set(socket.handshake.session.username, socket.id);
    console.log('New client connected to the push notification service');

    this.broadcastInfoAboutNewUser(socket, socket.handshake.session.username);

    socket.on('disconnect', () => {
      this.socketMap.delete(socket.handshake.session.username);
      console.log('User disconnected');
    });

    socket.on('privateChat', msg => {
      this.conversationStore.add(socket.handshake.session.username, msg.target, msg.body);
      this.io.to(this.socketMap.get(msg.target)).emit('privateChat', {
        from: socket.handshake.session.username,
        body: msg.body
      });
    });
  }

};