'use strict';

const {Server} = require('./lib/server');

const server = new Server(5555);
server.start();