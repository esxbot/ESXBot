/**
 * @file userMissingPermissions event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = permissions => {
  /* eslint-disable no-console*/
  console.log(`Necessidades do usuário ${permissions.replace('_', ' ')} permissão para usar este comando.`);
  /* eslint-enable no-console*/
};
