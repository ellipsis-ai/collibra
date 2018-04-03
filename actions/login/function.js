function(username, password, ellipsis) {
  const getSessionToken = require('session-token');
const saveLogin = require('saved-login').saveLogin;

getSessionToken(ellipsis, username, password).
  then(res => saveLogin(ellipsis, username, password)).
  then(ellipsis.success).
  catch(err => ellipsis.error(`Unable to login to \`${username}\` with that password`));
}
