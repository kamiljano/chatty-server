'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
chai.should();

const {Server} = require('../../lib/server');
const httpStatus = require('http-status-codes');
const userMock = require('./userMock');
const request = require('request-promise-native');

const PORT = 6666;
const URL_BASE = `http://localhost:${PORT}`;

describe('GIVEN a chatty server', () => {

  let server;

  beforeEach(() => {
    server = new Server({port: PORT});
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

  it('WHEN sending a request to an endpoint that requires authentication but without authenticating first, THEN an appropriate error is returned', async () => {
    let error;
    try {
      await request.get(`${URL_BASE}/api/v1/users`);
    } catch (err) {
      error = err;
    }
    error.should.not.be.undefined;
    error.statusCode.should.equal(httpStatus.UNAUTHORIZED);
  });

});