function(searchQuery, ellipsis) {
  const addableAssetsMatching = require('asset-helpers').addableAssetsMatching;
addableAssetsMatching(ellipsis, searchQuery, { assetTypeName: "Acronym" }).then(ellipsis.success);
}
