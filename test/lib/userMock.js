'use strict';

const request = require('request-promise-native');
const io = require('socket.io-client');

class User {

  constructor(username, cookieJar, urlBase, socket) {
    this.username = username;
    this.cookieJar = cookieJar;
    this.urlBase = urlBase;
    this.socket = socket;
  }

  getCurrentSession() {
    return request.get(`${this.urlBase}/api/v1/users/~`, {
      json: true,
      jar: this.cookieJar
    });
  }

  onPrivateMessage(callback) {
    this.socket.on(this.username, callback);
  }

  sendPrivateMessage(targetUsername, message) {
    return this.socket.emit('privateChat', {
      body: message,
      recipient: targetUsername
    });
  }

  close() {
    this.socket.close();
  }
}

module.exports.createUser = async (urlBase, username) => {
  const cookieJar = request.jar();
  const response = await request.post(`${urlBase}/api/v1/users`, {
    json: true,
    resolveWithFullResponse: true,
    body: {username},
    jar: cookieJar
  });
  const socket = io.connect(urlBase);
  await new Promise(resolve => socket.on('connect', resolve));
  socket.on('disconnect', () => {
    console.info('Disconnected from the pubsub');
  });
  return {
    response,
    user: new User(username, cookieJar, urlBase, undefined)
  }
};