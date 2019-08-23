function(searchQuery, ellipsis) {
  const assetsMatching = require('asset-helpers').assetsMatching;
assetsMatching(ellipsis, searchQuery, { assetTypeName: "Acronym" }).then(ellipsis.success);
}
