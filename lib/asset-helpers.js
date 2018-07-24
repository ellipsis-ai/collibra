/*
@exportId DxJgJij4RGiOMJ2dw4ktew
*/
module.exports = (function() {
const CollibraApi = require('collibra-api');
const formatAttribute = require('definition-helpers').textForAttribute;

return {
  assetsMatching: assetsMatching,
  addableAssetsMatching: addableAssetsMatching,
  respondWithChosenAsset: respondWithChosenAsset,
  respondWithChosenAssetOrAddNew: respondWithChosenAssetOrAddNew
};

function respondWithChosenAsset(asset, ellipsis) {
  CollibraApi(ellipsis).then(api => {
    api.definitionAttributesFor(asset.id).then(attrs => {
      const definitions = attrs.map(formatAttribute).filter(ea => ea.length > 0);
      const hasDefinition = definitions.length > 0;
      const successResult = {
        isAddingNew: false,
        name: asset.label,
        link: api.linkFor("asset", asset.id),
        hasDefinition: hasDefinition,
        definitions: definitions
      };
      const options = hasDefinition ? {} : {
        choices: [
          {
            label: "Add a definition",
            actionName: "add-definition", 
            args: [ { name: "asset", value: asset.id } ]
          }
        ]
      };
      ellipsis.success(successResult, options);
    });
  });
}

function respondWithChosenAssetOrAddNew(ellipsis, asset, optionalAssetTypeName) {
  CollibraApi(ellipsis).then(api => {
    if (asset.id == "ellipsis-add-new") {
      api.findAssetTypeIdNamed(optionalAssetTypeName).then(optionalAssetTypeId => {
        addNewAsset(ellipsis, asset, optionalAssetTypeId).then(ellipsis.success);
      })
    } else {
      respondWithChosenAsset(asset, ellipsis);
    }
  });
}

function addNewAsset(ellipsis, asset, optionalAssetTypeId) {
  const defaultDomain = ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID;
  ellipsis.success({ isAddingNew: true }, {
    next: {
      actionName: "add-asset",
      args: [ 
        { name: "name", value: asset.searchQuery },
        { name: "domain", value: defaultDomain },
        { name: "assetType", value: optionalAssetTypeId }
      ]
    }
  });
}

function assetsMatching(ellipsis, searchQuery, optionalAssetTypeName) {
  return new Promise((resolve, reject) => {
    CollibraApi(ellipsis).then(api => {
      api.findAssetTypeIdNamed(optionalAssetTypeName).then(optionalAssetTypeId => {
        api.findAsset(searchQuery).then(asset => {
          const idMatches = asset ? [asset] : [];
          api.matchingAssets(searchQuery, optionalAssetTypeId).then(matches => {
            resolve(matches.concat(idMatches).map(ea => {
              return {
                id: ea.id,
                label: ea.name
              };
            }));
          });
        });
      });
    });
  });
}

function addableAssetsMatching(ellipsis, searchQuery, optionalAssetTypeName) {
  return new Promise((resolve, reject) => {
    assetsMatching(ellipsis, searchQuery, optionalAssetTypeName).then( matches => {
      resolve(matches.concat(extraOptionsFor(matches, searchQuery)));
    });
  });
}

function extraOptionsFor(matches, searchQuery, optionalAssetTypeName) {
  const exactMatch = matches.find(ea => ea.label.toLowerCase().trim() === searchQuery.toLowerCase().trim());
  if (exactMatch) {
    return [];
  } else {
    const addTypeText = optionalAssetTypeName ? optionalAssetTypeName : "asset";
    return [
      {
        id: "ellipsis-add-new",
        label: matches.length > 0 ?
          `Add a new ${addTypeText} named “${searchQuery}”…` :
          `No matches found — add a new one named “${searchQuery}”…`,
        searchQuery: searchQuery
      }
    ];
  }
}

})()
     