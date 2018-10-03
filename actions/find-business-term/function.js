function(businessTerm, ellipsis) {
  const respondWithChosenAssetOrAddNew = require('asset-helpers').respondWithChosenAssetOrAddNew;
respondWithChosenAssetOrAddNew(ellipsis, businessTerm, { assetTypeName: "Business Term"});
}
