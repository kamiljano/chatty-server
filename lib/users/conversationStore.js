'use strict';

const isMatchingConv = (user1, user2, conv) =>
  (conv.from === user1 || conv.to === user1) && (conv.from === user2 || conv.to === user2);

module.exports.ConversationStore = class {

  constructor() {
    this.conversations = [];
  }

  add(from, to, message) {
    this.conversations.push({from, to, message});
  }

  getMessagesWithUsers(user1, user2) {
    return this.conversations.filter(conv => isMatchingConv(user1, user2, conv));
  }

  getLastMessageWithUsers(user1, user2) {
    for (let i = this.conversations.length - 1; i >= 0; i--) {
      if (isMatchingConv(user1, user2, this.conversations[i])) {
        return this.conversations[i];
      }
    }
    return null;
  }
};