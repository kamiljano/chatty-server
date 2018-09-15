'use strict';

const Joi = require('joi');
const httpStatus = require('http-status-codes');

module.exports = {
  create: {
    schema: {
      username: Joi.string().alphanum().min(2).max(25).required()
    },
    controller: userManager => {
      return (req, res) => {
        //For now skipping freeing of usernames
        //In real life these users would be stored in a database rather than just in a session
        userManager.add(req.body.username);
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
  }
};