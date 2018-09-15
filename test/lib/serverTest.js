'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
chai.should();

const {Server} = require('../../lib/server');
const httpStatus = require('http-status-codes');
const userMock = require('./userMock');

const PORT = 3000;
const URL_BASE = `http://localhost:${PORT}`;

describe('GIVEN a chatty server', () => {

  let server;

  beforeEach(() => {
    server = new Server(PORT);
    return server.start();
  });

  afterEach(() => server.stop());

  it('WHEN requesting a new username, THEN the username is successfully acquired', async () => {
    const {response} = await userMock.createUser(URL_BASE, 'newUser');
    response.statusCode.should.equal(httpStatus.CREATED);
  });

  it('WHEN requesting a new username and then requesting for the data for the current session, THEN the current session is returned', async () => {
    const username = 'userWithSession';
    const {user} = await userMock.createUser(URL_BASE, username);
    const currentSession = await user.getCurrentSession();
    currentSession.username.should.equal(username);
  });

  it('WHEN requesting the same username twice, THEN the second request is conflicting', async () => {
    const username = 'testUserToConflict';
    await userMock.createUser(URL_BASE, username);
    let error;
    try {
      await userMock.createUser(URL_BASE, username);
    } catch (err) {
      error = err;
    }
    error.should.not.be.undefined;
    error.statusCode.should.equal(httpStatus.CONFLICT);
  });

  it('WHEN requesting a username with space, THEN an error is returned', async () => {
    let error;
    try {
      await userMock.createUser(URL_BASE, 'user in wrong format');
    } catch (err) {
      error = err;
    }
    error.should.not.be.undefined;
    error.statusCode.should.equal(httpStatus.BAD_REQUEST);
  });

  it('WHEN 2 users send private messages to each other, THEN the messages are successfully delivered', async () => {
    const {user: user1} = await userMock.createUser(URL_BASE, 'user1');
    const {user: user2} = await userMock.createUser(URL_BASE, 'user2');
    const messagePromise = new Promise(resolve => user2.onPrivateMessage(resolve));
    const messageToSend = 'testMessage';
    await user1.sendPrivateMessage(user2.username, messageToSend);
    const message = await messagePromise;
    message.body.should.equal(messageToSend);
    message.sender.should.equal(user1.username);
    user1.close();
    user2.close();
  });

});