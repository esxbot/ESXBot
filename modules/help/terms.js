/**
 * @file terms command
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

exports.exec = (ESXBot, message) => {
  message.channel.send({
    embed: {
      color: ESXBot.colors.BLUE,
      title: 'ESXBot - Termos de serviço',
      url: 'https://esxbot.github.io/',
      description: '\nO ESXBot tem acesso aos Dados do Usuário Final através da Discord API, mas o ESXBot não coleta, usa ou divulga Dados do Usuário Final exceto (a) conforme necessário para exercer seus direitos sob este Contrato, (b) de acordo com a Política de Privacidade do Discord .' +
        '\n\nNós nunca iremos vender, licenciar ou comercializar quaisquer Dados do Usuário Final. Também não usaremos os dados do usuário final para segmentar os usuários finais para fins de marketing ou publicidade. Nunca divulgaremos dados de usuário final a nenhuma rede de publicidade, intermediário de dados ou outro serviço relacionado a publicidade ou monetização.' +
        '\n\nOs dados do usuário final serão retidos apenas quando necessário para fornecer a funcionalidade definida do aplicativo e nada mais.' +
        '\n\nGarantimos que todos os Dados do Usuário Final são armazenados usando medidas de segurança razoáveis e tomamos medidas razoáveis para proteger os Dados do Usuário Final.' +
        '\n\nAo usar o ESXBot, você concorda expressamente com este Contrato. E usando o Discord você concorda expressamente com o Discord’s [Termos de serviço](https://discordapp.com/terms), [Diretrizes](https://discordapp.com/guidelines) e [Política de Privacidade](https://discordapp.com/privacy).' +
        '\n\n\n*“Dados do usuário final” significa todos os dados associados ao conteúdo dentro da funcionalidade permitida pela Discord API, incluindo, entre outros, conteúdo de mensagens, metadados de mensagens, dados de voz e metadados de voz.*'
    }
  }).catch(e => {
    ESXBot.log.error(e);
  });
};

exports.config = {
  aliases: ['termos'],
  enabled: true
};

exports.help = {
  name: 'terms',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'terms',
  example: []
};
