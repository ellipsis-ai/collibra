function(businessTerm, ellipsis) {
  const respondWithChosenAssetOrAddNew = require('asset-helpers').respondWithChosenAssetOrAddNew;
respondWithChosenAssetOrAddNew(ellipsis, businessTerm, "Business Term").then(ellipsis.success);
}
