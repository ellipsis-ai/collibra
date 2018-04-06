function(ellipsis) {
  const deleteSavedLoginForCurrentUser = require('saved-login').deleteSavedLoginForCurrentUser;
const deleteSessionTokenFor = require('session-token').deleteSessionTokenFor;

deleteSavedLoginForCurrentUser(ellipsis).then(res => {
  const deleted = res.data && res.data.deleteWhereLogin[0] ? res.data && res.data.deleteWhereLogin[0] : undefined;
  (deleted ? deleteSessionTokenFor(deleted.username, ellipsis) : Promise.resolve()).then(res => {
    const msg = (deleted && deleted.username) ? `OK, you are no longer \`${deleted.username}\`.` : `Resignation accepted!`;
    ellipsis.success(msg);
  });
});
}
