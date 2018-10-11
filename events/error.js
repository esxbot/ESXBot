/**
 * @file error event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const COLOR = require('chalk');

module.exports = (error, description, channel) => {
  if (channel) {
    channel.send({
      embed: {
        color: channel.client.colors.RED,
        title: `${error}`,
        description: `${description}`
      }
    }).catch(e => {
      channel.client.log.error(e);
    });
  }
  else {
    /* eslint-disable no-console */
    console.log(COLOR.red('[ERROR EVENT]'));
    console.log(error);
    console.log(COLOR.red('[/ERROR EVENT]'));
  }
};
