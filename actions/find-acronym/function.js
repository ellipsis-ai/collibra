function(acronym, ellipsis) {
  const respondWithChosenAsset = require('asset-helpers').respondWithChosenAsset;
respondWithChosenAsset(ellipsis, acronym, { assetTypeName: "Acronym"});
}
