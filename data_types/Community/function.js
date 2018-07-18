function(ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.listCommunities().then(communities => {
  ellipsis.success(communities.map(ea => {
    return {
      id: ea.id,
      label: `${ea.name}`
    };
  }));
});
}
