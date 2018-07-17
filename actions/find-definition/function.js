function(asset, ellipsis) {
  const respondWithChosenAssetOrAddNew = require('asset-helpers').respondWithChosenAssetOrAddNew;
respondWithChosenAssetOrAddNew(ellipsis, asset).then(ellipsis.success);
}
