function(searchQuery, ellipsis) {
  const assetsMatching = require('asset-helpers').assetsMatching;

assetsMatching(ellipsis, searchQuery).then(ellipsis.success);
}
