function(searchQuery, ellipsis) {
  const assetsMatching = require('asset-helpers').assetsMatching;

assetsMatching(searchQuery, ellipsis).then(ellipsis.success);
}
