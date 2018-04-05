function(username, password, ellipsis) {
  const getSessionToken = require('session-token');
const saveLogin = require('saved-login').saveLogin;

getSessionToken(ellipsis, username, password).
  then(res => saveLogin(ellipsis, username, password)).
  then(res => ellipsis.success(`:thumbsup: Your Slack account is associated with the Collibra user **${username}**.`)).
  catch(err => ellipsis.success(err.userMessage || `Unable to login to **${username}** with that password.`));
}
