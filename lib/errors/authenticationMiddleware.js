'use strict';

const {RequestError} = require('./errors');
const httpStatus = require('http-status-codes');

class AuthenticationError extends RequestError {
  constructor() {
    super(httpStatus.UNAUTHORIZED, 'The call to this endpoint is not possible without acquiring the username first');
  }
}

const isAuthenticated = req => Boolean(req.session.username);

const isPublicEndpointRequest = (publicEndpoints, req) => {
  const method = req.method.toLowerCase();
  return publicEndpoints && publicEndpoints[method] && publicEndpoints[method].includes(req.path);
};

module.exports = publicEndpoints => {
  return (req, res, next) => {
    if (!isAuthenticated(req) && !isPublicEndpointRequest(publicEndpoints, req)) {
      throw new AuthenticationError();
    }
    next();
  };
};