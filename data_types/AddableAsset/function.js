function(searchQuery, ellipsis) {
  const addableAssetsMatching = require('asset-helpers').addableAssetsMatching;
addableAssetsMatching(ellipsis, searchQuery, {}).then(ellipsis.success);
}
