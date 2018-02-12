function(searchQuery, ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.matchingAssets(searchQuery).then(matches => {
  ellipsis.success(matches.map(ea => {
    return {
      id: ea.id,
      label: `${ea.name} (${ea.domain.name})`
    };
  }))
});
}
