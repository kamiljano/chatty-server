'use strict';

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const errorMiddleware = require('./errors/errorMiddleware');
const bodyParser = require('body-parser');
const {UserManager} = require('./users/userManager');
const httpStatus = require('http-status-codes');
const usersEndpoint = require('./users/usersEndpoint');
const schemaValidationMiddleware = require('./errors/schemaValidationMiddleware');
const expressSession = require('express-session');
const uuidv4 = require('uuid/v4');
const sharedsession = require("express-socket.io-session");
const _ = require('lodash');

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

      app.use(express.static('public'));

      const session = expressSession({
        secret: uuidv4(),
        resave: true,
        saveUninitialized: true
      })

      app.use(session);

      io.use(sharedsession(session, {
        autoSave: true
      }));

      io.on('connection', socket => {
        if (!_.has(socket, 'handshake.session.username')) {
          console.warn('Attempting to open a socket without selecting a username');
          socket.disconnect();
          return;
        }
        console.log('New client connected to the push notification service');
        socket.on('disconnect', () => {
          console.log('User disconnected');
        });
        socket.on('privateChat', msg => {
          console.log(msg);
        });
      });

      const router = express.Router();

      router.use(bodyParser.json());

      router.get('/health', (req, res) => {
        res.status(httpStatus.OK).send({server: true});
      });

      router.post('/users', schemaValidationMiddleware(usersEndpoint.create.schema), usersEndpoint.create.controller(userManager));

      router.get('/users/~', usersEndpoint.get.controller);

      app.use('/api/v1', router);

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