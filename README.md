[![Build Status](https://travis-ci.org/kamiljano/chatty-server.svg?branch=master)](https://travis-ci.org/kamiljano/chatty-server)

# About

A small chat server written in Node.js.
The chat supports:

* choosing a nick name
* talking on the room
* sending private messages

# Test

    npm test
    
# Run

    node index.js --uiUrl 'http://localhost:3000'
    
The parameter `uiUrl` is used to set up the CORS headers. If not specified,
by default it points to `http://localhost:3000`