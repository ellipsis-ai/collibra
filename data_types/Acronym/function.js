function(searchQuery, ellipsis) {
  const assetsMatching = require('asset-helpers').assetsMatching;
assetsMatching(ellipsis, searchQuery, { assetTypeName: "Acronym" }).then(assets => {
  if (assets.length === 1) {
    ellipsis.success(assets[0]);
  } else {
    ellipsis.success(assets);
  }
});
}
