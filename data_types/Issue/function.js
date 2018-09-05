function(searchQuery, ellipsis) {
  const assetsMatching = require('asset-helpers').assetsMatching;
const options = { 
  assetTypeName: "Issue",
  dontLimitDomain: true,
  excludeMeta: false
};

assetsMatching(ellipsis, searchQuery, options).then(ellipsis.success);
}
