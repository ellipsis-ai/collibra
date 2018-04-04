function(searchQuery, ellipsis) {
  const assetsMatching = require('asset-helpers').assetsMatching;

const extraOptions = [
  { id: "ellipsis-add-new", label: `Add a new asset named "${searchQuery}"…`, searchQuery: searchQuery }
];

assetsMatching(searchQuery, ellipsis).then( matches => {
  ellipsis.success(matches.concat(extraOptions));
});
}
