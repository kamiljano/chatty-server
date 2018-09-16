'use strict';

const Joi = require('joi');
const httpStatus = require('http-status-codes');

module.exports = {
  create: {
    schema: {
      username: Joi.string().alphanum().min(2).max(25).required()
    },
    controller: userStore => {
      return (req, res) => {
        userStore.add(req.body.username);
        req.session.username = req.body.username;
        res.status(httpStatus.CREATED).send({
          username: req.body.username
        });
      }
    }
  },
  get: {
    controller: (req, res) => {
      res.status(httpStatus.OK).send(req.session);
    }
  },
  list: {
    controller: (userStore, conversationStore) => {
      return (req, res) => {

        res.status(httpStatus.OK).send({});
      };
    }
  }
};