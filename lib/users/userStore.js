'use strict';

const {RequestError} = require('../errors/errors');
const httpStatus = require('http-status-codes');

class UsernameNotAvailable extends RequestError {

  constructor(username) {
    super(httpStatus.CONFLICT, `The username ${username} is already in use`);
  }

}

module.exports.UserStore = class {

  constructor() {
    this.users = new Map();
    this.currentPhotoId = 1;
  }

  add(username) {
    if (this.users.has(username)) {
      throw new UsernameNotAvailable(username);
    }
    const userData = {
      photo: `/img/users/${this.currentPhotoId}.png`
    };
    this.users.set(username, userData);
    this.currentPhotoId++;
    if(this.currentPhotoId > 10){
      this.currentPhotoId = 1;
    }
    return userData;
  }
};