function(searchQuery, ellipsis) {
  const addableAssetsMatching = require('asset-helpers').addableAssetsMatching;
addableAssetsMatching(ellipsis, searchQuery, { assetTypeName: "Report" }).then(ellipsis.success);
}
