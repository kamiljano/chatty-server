'use strict';

const chai = require('chai');
chai.use(require('sinon-chai'));
chai.should();

const {Server} = require('../../lib/server');
const request = require('request-promise-native');
const httpStatus = require('http-status-codes');

const PORT = 8888;
const URL_BASE = `http://localhost:${PORT}`;

describe('GIVEN a chatty server', () => {

  let server;

  before(() => {
    server = new Server(PORT);
    return server.start();
  });

  after(() => server.stop());

  const createUser = username => request.post(`${URL_BASE}/users`, {
    json: true,
    resolveWithFullResponse: true,
    body: {username}
  });

  it('WHEN requesting a new username, THEN the username is successfully acquired', async () => {
    const response = await createUser('newUser');
    response.statusCode.should.equal(httpStatus.CREATED);
  });

  it('WHEN requesting the same username twice, THEN the second request is conflicting', async () => {
    const username = 'testUserToConflict';
    await createUser(username);
    let error;
    try {
      await createUser(username);
    } catch (err) {
      error = err;
    }
    error.should.not.be.undefined;
    error.statusCode.should.equal(httpStatus.CONFLICT);
  });

});