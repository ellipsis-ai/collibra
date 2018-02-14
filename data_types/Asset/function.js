function(searchQuery, ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

const extraOptions = [
  { id: "ellipsis-add-new", label: `Add a new asset named "${searchQuery}"…`, searchQuery: searchQuery }
];

api.matchingAssets(searchQuery).then(matches => {
  ellipsis.success(matches.map(ea => {
    return {
      id: ea.id,
      label: `${ea.name} (${ea.domain.name})`
    };
  }).concat(extraOptions));
});
}
