/**
 * @file userCredit event
 * @author Renildo Marcio (KR Soluções Web)
 * @license MIT
 */

module.exports = async (user, amount) => {
  try {
    let userProfile = await user.client.db.get(`SELECT esxbotCurrencies FROM profiles WHERE userID=${user.id}`);

    /*
    * If the user doesn't have a profile, yet, we don't allow
    * to deduct ESXBot Moedas from them.
    */
    if (!userProfile) return;

    /*
    * Deduct the given amount of ESXBot Moedas from the user's account.
    * Yes, if they have less ESXBot Moedas then the given amount,
    * that will still be deducted from their account.
    */
    await user.client.db.run(`UPDATE profiles SET esxbotCurrencies=${parseInt(userProfile.esxbotCurrencies) - parseInt(amount)} WHERE userID=${user.id}`);

    /*
    * Add the transaction detail to transactions table.
    */
    await user.client.db.run('INSERT INTO transactions (userID, type, amount) VALUES (?, ?, ?)', [ user.id, 'userCredit', parseInt(amount) ]);
  }
  catch (e) {
    user.client.log.error(e);
  }
};
