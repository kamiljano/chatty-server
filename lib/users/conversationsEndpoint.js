'use strict';

const {RequestError} = require('../errors/errors');
const httpStatus = require('http-status-codes');

class SelfConversationError extends RequestError {
  constructor() {
    super(httpStatus.BAD_REQUEST, `It's not legal to list the conversations with yourself`);
  }

}

const replaceUserWithTilda = (currentUser, convos) => convos.map(conv => {
  return conv.from === currentUser ?
    {
      from: '~',
      to: conv.to,
      message: conv.message
    } : {
      from: conv.from,
      to: '~',
      message: conv.message
    };
});

module.exports = {

  list: {
    controller: conversationStore => {
      return (req, res) => {
        if (req.params.user === req.session.username) {
          throw new SelfConversationError();
        }
        const convos = conversationStore.getMessagesWithUsers(req.session.username, req.params.user);
        res.status(httpStatus.OK).send(replaceUserWithTilda(req.session.username, convos));
      }
    }
  }

};