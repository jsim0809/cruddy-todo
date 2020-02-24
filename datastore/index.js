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

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
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
