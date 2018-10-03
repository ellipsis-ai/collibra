function(searchQuery, ellipsis) {
  const addableAssetsMatching = require('asset-helpers').addableAssetsMatching;
addableAssetsMatching(ellipsis, searchQuery, { assetTypeName: "Business Term"}).then(ellipsis.success);
}
