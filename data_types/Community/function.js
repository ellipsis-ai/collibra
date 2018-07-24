function(ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.listCommunities().then(communities => {
    ellipsis.success(communities.map(ea => {
      return {
        id: ea.id,
        label: `${ea.name}`
      };
    }));
  });  
});
}
