'use strict';

module.exports.ConversationStore = class {

  constructor() {
    this.conversations = [];
  }

  add(from, to, message) {
    this.conversations.push({from, to, message});
  }

  getMessagesWithUsers(user1, user2) {
    return this.conversations.filter(conv =>
      (conv.from === user1 || conv.to === user1) && (conv.from === user2 || conv.to === user2)
    );
  }
};