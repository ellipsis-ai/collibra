function(report, ellipsis) {
  const respondWithChosenAssetOrAddNew = require('asset-helpers').respondWithChosenAssetOrAddNew;
respondWithChosenAssetOrAddNew(ellipsis, report, { assetTypeName: "Report"});
}
