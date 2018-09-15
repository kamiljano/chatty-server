'use strict';

const {RequestError} = require('../errors/errors');
const httpStatus = require('http-status-codes');

class UsernameNotAvailable extends RequestError {

  constructor(username) {
    super(httpStatus.CONFLICT, `The username ${username} is already in use`);
  }

}

module.exports.UserManager = class {

  constructor() {
    this.users = [];
  }

  add(username) {
    if (this.users.includes(username)) {
      throw new UsernameNotAvailable(username);
    }
    this.users.push(username);
  }

  //For now skipping freeing of usernames
  //In real life these users would be stored in a database rather than just in a session
};