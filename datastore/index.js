const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId( (err, newID) => {
    if (err) {
      throw ('error creating unique ID');
    } else {
      // a string
      fs.writeFile(path.join(exports.dataDir, newID) + '.txt', text, (err) => {
        if (err) {
          throw ('error writing file');
        } else {
          callback(null, {id: newID, text: text});
        }
      });
    }
  });
};

// sends back an array of "todos"
// todo looks like {id: <id>, text: <id>}
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, fileArray) => {
    if (err) {
      throw ('error reading directory');
    } else {
      callback(null, _.map(fileArray, (fileName) => {
        return {id: fileName.slice(0, -4), text: fileName.slice(0, -4) };
      }));
    }
  });
};

// read todo from dataDir based on id
// must read contents of todo item file and send contents in response to client
exports.readOne = (id, callback) => {
  // construct filepath based on ID
  // fs.readFile of that
  fs.readFile(path.join(exports.dataDir, id) + '.txt', 'utf8', (err, fileText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`), null);
    } else {
      callback(null, {id, text: fileText});
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
