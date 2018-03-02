function(ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.allRoles().then(roles => {
  ellipsis.success(roles.map(ea => {
    return {
      id: ea.id,
      label: `${ea.name}`
    };
  }));
});
}
