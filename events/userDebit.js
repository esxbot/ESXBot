/**
 * @file userDebit event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = async (user, amount) => {
  try {
    let userProfile = await user.client.db.get(`SELECT esxbotCurrencies FROM profiles WHERE userID=${user.id}`);

    /*
    * If the user doesn't have a profile, create their profile
    * & add ESXBot Moedas.
    */
    if (!userProfile) {
      return await user.client.db.run('INSERT INTO profiles (userID, esxbotCurrencies) VALUES (?, ?)', [ user.id, parseInt(amount) ]);
    }

    /*
    * Add the given amount of ESXBot Moedas to the user's account.
    */
    await user.client.db.run(`UPDATE profiles SET esxbotCurrencies=${parseInt(userProfile.esxbotCurrencies) + parseInt(amount)} WHERE userID=${user.id}`);

    /*
    * Add the transaction detail to transactions table.
    */
    await user.client.db.run('INSERT INTO transactions (userID, type, amount) VALUES (?, ?, ?)', [ user.id, 'userDebit', parseInt(amount) ]);
  }
  catch (e) {
    user.client.log.error(e);
  }
};
