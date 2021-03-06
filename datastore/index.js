const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

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
  var readdirAsync = Promise.promisify(fs.readdir);
  var readOneAsync = Promise.promisify(exports.readOne);

  return readdirAsync(exports.dataDir)
    .then((array) => {
      callback(null, Promise.all(_.map(array, (fileName) => {
        return {id: fileName.slice(0, -4), text: exports.readOneAsync(fileName)};
      })));
    })
    .catch((error) => {
      throw (error);
    });
};

/*
  // get array of fileNames
  // THEN iterate over each file named by fileName
    // in each file, retrieve text and create new array of todo objects
  // THEN (after Promises.All) return array from one up the chain
*/

// fs.readdir(exports.dataDir, (err, fileArray) => {
//   if (err) {
//     throw ('error reading directory');
//   } else {
//     callback(null, _.map(fileArray, (fileName) => {
//       return {id: fileName.slice(0, -4), text: exports.readOne(fileName, (err, fileText) => {
//         if (err) {
//           throw ('error');
//         } else {
//           return fileText;
//         }
//       })};
//     }));
//   }
// });

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
  exports.readOne(id, (err, todoItem) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`), null);
    } else {
      fs.writeFile(path.join(exports.dataDir, id) + '.txt', text, (err) => {
        if (err) {
          throw ('error writing file');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

// remove todo file stored in dataDir based on id
exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id) + '.txt', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`), null);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
