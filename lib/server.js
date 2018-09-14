'use strict';

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const errorMiddleware = require('./errors/errorMiddleware');
const bodyParser = require('body-parser');
const {UserManager} = require('./users/userManager');
const httpStatus = require('http-status-codes');

module.exports.Server = class {

  constructor(port = 5555) {
    this.port = port;
  }

  start() {
    return new Promise(resolve => {
      const app = express();
      const server = http.Server(app);
      const io = socketio(server);
      const userManager = new UserManager();

      app.use(bodyParser.json());

      app.get('/health', (req, res) => {
        res.status(httpStatus.OK).send({server: true});
      });

      app.post('/users', (req, res) => {
        userManager.add(req.body.username);
        res.status(httpStatus.CREATED).send({
          username: req.body.username
        });
      });

      app.use(errorMiddleware);

      this._server = server.listen(this.port, () => {
        console.info(`Listening on localhost:${this.port}`);
        resolve();
      });
    });
  }

  stop() {
    this._server.close();
  }
};