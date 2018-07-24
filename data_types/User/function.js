function(searchQuery, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.matchingUsers(searchQuery).then(users => {
    ellipsis.success(users.map(ea => {
      return {
        id: ea.id,
        label: `${ea.userName} (${ea.firstName} ${ea.lastName})`
      };
    }));
  });
});
}
