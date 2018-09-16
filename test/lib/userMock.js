'use strict';

const request = require('request-promise-native');

class User {

  constructor(username, cookieJar, urlBase) {
    this.username = username;
    this.cookieJar = cookieJar;
    this.urlBase = urlBase;
  }

  getCurrentSession() {
    return request.get(`${this.urlBase}/api/v1/users/~`, {
      json: true,
      jar: this.cookieJar
    });
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
  return {
    response,
    user: new User(username, cookieJar, urlBase)
  }
};