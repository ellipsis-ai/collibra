function(ellipsis) {
  const CollibraApi = require('collibra-api');
CollibraApi(ellipsis).then(api => {
  api.allRoles().then(roles => {
    ellipsis.success(roles.map(ea => {
      return {
        id: ea.id,
        label: `${ea.name}`
      };
    }));
  });  
});
}
