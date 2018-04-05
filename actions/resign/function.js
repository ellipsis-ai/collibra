function(ellipsis) {
  const deleteSavedLoginForCurrentUser = require('saved-login').deleteSavedLoginForCurrentUser;

deleteSavedLoginForCurrentUser(ellipsis).then(res => {
  const deleted = res.data && res.data.deleteWhereLogin[0] ? res.data && res.data.deleteWhereLogin[0] : undefined;
  const msg = deleted.username ? `OK, you are no longer \`${deleted.username}\`.` : `Resignation accepted!`;
  ellipsis.success(msg);
});
}
