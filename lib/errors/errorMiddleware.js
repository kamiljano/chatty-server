'use strict';

const {RequestError} = require('./errors');
const httpStatus = require('http-status-codes');

module.exports = (err, req, res, next) => {
  if (!err) {
    next();
  }

  if (err instanceof RequestError) {
    res.status(err.code).send({
      error: err.message
    });
  } else {
    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      error: 'An unexpected error has occurred'
    });
  }
};