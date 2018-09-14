'use strict';

const expressJoi = require('express-joi');
const httpStatus = require('http-status-codes');

module.exports = {
  create: {
    schema: {
      username: expressJoi.Joi.types.String().alphanum().min(2).max(25).required()
    },
    controller: userManager => {
      return (req, res) => {
        userManager.add(req.body.username);
        res.status(httpStatus.CREATED).send({
          username: req.body.username
        });
      }
    }
  }
};