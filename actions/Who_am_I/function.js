function(ellipsis) {
  const getLoginForCurrentUser = require('saved-login').getLoginForCurrentUser;

getLoginForCurrentUser(ellipsis).then(login => {
  ellipsis.success(login.username);
});
}
