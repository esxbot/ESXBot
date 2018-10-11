/**
 * @file warn event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = info => {
  /* eslint-disable no-console */
  console.log(COLOR.yellow('[WARNING EVENT]'));
  console.log(info);
  console.log(COLOR.yellow('[/WARNING EVENT]'));
  /* eslint-enable no-console */
};
