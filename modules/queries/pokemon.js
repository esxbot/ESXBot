/**
 * @file pokemon command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

const Pokedex = require('pokedex-api');
const pokedex = new Pokedex({
  userAgent: 'ESXBot: Discord Bot (https://esxbot.github.io)',
  version: 'v1'
});

exports.exec = async (ESXBot, message, args) => {
  try {
    let pokemon;
    if (args.name) {
      pokemon = await pokedex.getPokemonByName(encodeURIComponent(args.name.join(' ')));
    }
    else if (args.number) {
      pokemon = await pokedex.getPokemonByNumber(args.number);
    }
    else {
      /**
      * The command was ran with invalid parameters.
      * @fires commandUsage
      */
      return ESXBot.emit('commandUsage', message, this.help);
    }

    pokemon = pokemon[0];

    let fields = [
      {
        name: 'Número',
        value: pokemon.number,
        inline: true
      },
      {
        name: 'Espécies',
        value: pokemon.species,
        inline: true
      },
      {
        name: 'Tipos',
        value: pokemon.types.join('\n'),
        inline: true
      },
      {
        name: 'Habilidades',
        value: `Normal: ${pokemon.abilities.normal.join(', ') || '-'}\nEscondido: ${pokemon.abilities.hidden.join(', ') || '-'}`,
        inline: true
      },
      {
        name: 'Grupos de Ovos',
        value: pokemon.eggGroups.join('\n'),
        inline: true
      },
      {
        name: 'Razão de Gênero',
        value: pokemon.gender.length ? `${pokemon.gender[0]}:${pokemon.gender[1]}` : 'Sem gênero',
        inline: true
      },
      {
        name: 'Altura',
        value: pokemon.height,
        inline: true
      },
      {
        name: 'Peso',
        value: pokemon.weight,
        inline: true
      },
      {
        name: 'Linha de evolução',
        value: pokemon.family.evolutionLine.join(' -> ')
      }
    ];

    let note = '';
    if (pokemon.starter) {
      note = note.concat('É um pokemon inicial\n');
    }
    if (pokemon.legendary) {
      note = note.concat('É um pokemon lendário\n');
    }
    if (pokemon.mythical) {
      note = note.concat('É um pokemon mítico\n');
    }
    if (pokemon.ultraBeast) {
      note = note.concat('É um ultra besta\n');
    }
    if (pokemon.mega) {
      note = note.concat('Pode mega evoluir\n');
    }

    fields.push({
      name: 'Notas',
      value: note.length ? note : '-'
    });

    message.channel.send({
      embed: {
        color: ESXBot.colors.BLUE,
        title: pokemon.name,
        description: `Descoberto na geração ${pokemon.gen}`,
        fields: fields,
        thumbnail: {
          url: pokemon.sprite
        },
        footer: {
          icon_url: 'https://pokedevs.bastionbot.org/favicon.png',
          text: 'Powered by Pokedex API by PokéDevs'
        }
      }
    }).catch(e => {
      ESXBot.log.error(e);
    });
  }
  catch (e) {
    if (e.response) {
      return ESXBot.emit('error', e.response.statusCode, e.response.statusMessage, message.channel);
    }
    ESXBot.log.error(e);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true },
    { name: 'number', type: Number, alias: 'n' }
  ]
};

exports.help = {
  name: 'pokemon',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'pokemon < POKEMON NAME | -n POKEDEX_NUMBER >',
  example: [ 'pokemon Pikachu', 'pokemon -n 658' ]
};
