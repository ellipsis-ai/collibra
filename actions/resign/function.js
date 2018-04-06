function(ellipsis) {
  const deleteSavedLoginForCurrentUser = require('saved-login').deleteSavedLoginForCurrentUser;
const deleteSessionTokenFor = require('session-token').deleteSessionTokenFor;

deleteSavedLoginForCurrentUser(ellipsis).then(res => {
  const deleted = res.data && res.data.deleteWhereLogin[0] ? res.data && res.data.deleteWhereLogin[0] : undefined;
  (deleted ? deleteSessionTokenFor(deleted.username, ellipsis) : Promise.resolve()).then(res => {
    const msg = 
      (deleted && deleted.username) ? 
        `OK, you are no longer \`${deleted.username}\`. You are now the default Collibra user` : 
        `You were already the default Collibra user.`;
    ellipsis.success(msg);
  });
});
}
