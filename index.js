'use strict';

const {Server} = require('./lib/server');
const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'uiUrl', type: String, defaultValue: 'http://localhost:3000' } //for CORS
]);

const server = new Server({port: 5555, corsOrign: options.uiUrl});
server.start();