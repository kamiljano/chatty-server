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
        userManager.add(req.body.username); //TODO: currently the data is stored in there forever and ever -> either iterate through all sessions ensuring uniqueness of the user or
                                            //make sure that the collection is cleared when the session is over
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