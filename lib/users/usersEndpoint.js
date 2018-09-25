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
        const data = userStore.add(req.body.username);
        req.session.username = req.body.username;
        req.session.photo = data.photo;
        res.status(httpStatus.CREATED).send({
          username: req.body.username,
          photo: data.photo
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
        const result = [];
        for (let [key, value] of userStore.users.entries()){
          if (req.session.username !== key) {
            const lastMessage = conversationStore.getLastMessageWithUsers(req.session.username, key);
            result.push({
              username: key,
              photo: value.photo,
              lastMessage: lastMessage ? lastMessage.message : null
            });
          }
        }
        res.status(httpStatus.OK).send(result);
      };
    }
  }
};