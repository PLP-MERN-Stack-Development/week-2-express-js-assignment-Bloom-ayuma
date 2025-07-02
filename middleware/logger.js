const fs   = require('fs');
const path = require('path');

module.exports = (req, _res, next) => {
  const line = `${new Date().toISOString()}  ${req.method} ${req.originalUrl}\n`;
  // append to access.log + echo to console
  fs.appendFile(path.join(__dirname, '..', 'access.log'), line, () => {});
  console.log(line.trim());
  next();
};
