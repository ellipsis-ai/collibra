function(searchQuery, ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.matchingUsers(searchQuery).then(users => {
  ellipsis.success(users.map(ea => {
    return {
      id: ea.id,
      label: `${ea.userName} (${ea.firstName} ${ea.lastName})`
    };
  }));
});

}
