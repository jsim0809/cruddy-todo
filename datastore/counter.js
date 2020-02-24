const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  // goes into the file and tries to read the data.
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      // if it can't read the data, call the callback with no error and a "count" of 0.
      callback(null, 0);
    } else {
      // if it can, call the callback with no error and a "count" of whatever was inside the file.
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // call readCounter.
  // readCounter takes one callback, which will be run when the reading succeeds or fails.
  // no chance of error being returned (see readCounter code), but just in case, we write the function as if it could.
  readCounter( (err, returnedNumber) => {
    if (err) {
      throw ('error reading counter');
    } else {
      counter = returnedNumber;
    }
  });
  counter++;
  // call writeCounter, and return the value it returns.
  // writeCounter takes a number and a callback, which will be run when the writing succeeds or fails.
  // no chance of error being returned (see readCounter code), but just in case, we write the function as if it could.
  writeCounter(counter, (err, counterString) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
