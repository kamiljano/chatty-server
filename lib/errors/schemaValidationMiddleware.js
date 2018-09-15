'use strict';

const {RequestError} = require('./errors');
const httpStatus = require('http-status-codes');
const Joi = require('joi');

class SchemaValidationError extends RequestError {

  constructor(message) {
    super(httpStatus.BAD_REQUEST, message);
  }

}

module.exports = schema => {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      throw new SchemaValidationError(result.error);
    }
    next();
  };
};