function(username, ellipsis) {
  const SavedLogin = require('saved-login');
const getSessionToken = require('session-token');

SavedLogin.getLoginForUsername(ellipsis, username).then(login => {
  const password = login.password;
  getSessionToken(ellipsis, username, password).
    then(res => SavedLogin.saveLogin(ellipsis, username, password)).
    then(ellipsis.success).
    catch(err => ellipsis.error(`Unable to login to \`${username}\` with that password`));
});
}
