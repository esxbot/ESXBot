/**
 * @file streamNotifier
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
*/

const CronJob = require('cron').CronJob;
const request = require('request-promise-native');

/**
 * Handles ESXBot's scheduled commands
 * @param {ESXBot} ESXBot ESXBot Discord client object
 * @returns {void}
 */
module.exports = ESXBot => {
  try {
    let job = new CronJob('0 * * * * *',
      async () => {
        try {
          for (let guild of ESXBot.guilds) {
            guild = guild[1];
            let streamers = await ESXBot.db.get(`SELECT * FROM streamers WHERE guildID=${guild.id}`);
            if (streamers && streamers.channelID) {
              let twitchStreamers = streamers.twitch.split(' ');

              let options = {
                headers: {
                  'Client-ID': ESXBot.credentials.twitchClientID,
                  'Accept': 'Accept: application/vnd.twitchtv.v3+json'
                },
                url: `https://api.twitch.tv/kraken/streams/?channel=${twitchStreamers.join(',')}`,
                json: true
              };
              let response = await request(options);

              if (response._total > 0 && response.streams.length > 0) {
                let streams = response.streams;

                if (!guild.hasOwnProperty('lastStreamers')) {
                  guild.lastStreamers = [];
                }
                else {
                  /*
                   * If any live streamers (`lastStreamers`) have
                   * stopped streaming, remove them from `lastStreamers`.
                   */
                  guild.lastStreamers.forEach(stream => {
                    if (!streams.map(stream => stream._id).includes(stream)) {
                      guild.lastStreamers.splice(guild.lastStreamers.indexOf(stream), 1);
                    }
                  });
                }

                for (let stream of streams) {
                  /*
                   * If the (recently fetched) live streamer is not
                   * known, i.e. stored in `lastStreamers`, notify in the
                   * specified channel that the streamer is live, and add them
                   * to `lastStreamers`.
                   */
                  if (!guild.lastStreamers.includes(stream._id)) {
                    await ESXBot.channels.get(streamers.channelID).send({
                      embed: {
                        color: ESXBot.colors.PURPLE,
                        author: {
                          name: stream.channel.display_name,
                          url: stream.channel.url,
                          icon_url: stream.channel.logo
                        },
                        title: stream.channel.status,
                        url: stream.channel.url,
                        description: `${stream.channel.display_name} está agora vivo!`,
                        fields: [
                          {
                            name: 'Game',
                            value: stream.game,
                            inline: true
                          },
                          {
                            name: 'Espectadores',
                            value: stream.viewers,
                            inline: true
                          }
                        ],
                        image: {
                          url: `${stream.preview.large}?v=${Math.random()}`
                        },
                        timestamp: new Date(stream.created_at)
                      }
                    });

                    guild.lastStreamers.push(stream._id);
                  }
                }
              }
            }
          }
        }
        catch (e) {
          ESXBot.log.error(e);
        }
      },
      () => {},
      false
    );
    job.start();
  }
  catch (e) {
    ESXBot.log.error(e);
  }
};
