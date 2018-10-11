/**
 * @file Function Handler
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const fs = require('fs');

// eslint-disable-next-line no-sync
let functions = fs.readdirSync('./functions/');
for (let method of functions) {
  exports[method.replace('.js', '')] = require(`../functions/${method}`);
}
