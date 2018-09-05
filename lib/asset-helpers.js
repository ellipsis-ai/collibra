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

function respondWithChosenAsset(ellipsis, asset) {
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

function respondWithChosenAssetOrAddNew(ellipsis, asset, options) {
  if (asset.id == "ellipsis-add-new") {
    CollibraApi(ellipsis).then(api => {
      api.findAssetTypeIdNamed(options.assetTypeName).then(assetTypeId => {
        const newOptions = Object.assign({}, options, { assetTypeId: assetTypeId });
        addNewAsset(ellipsis, asset, newOptions).then(ellipsis.success);
      });
    }); 
  } else {
    respondWithChosenAsset(ellipsis, asset);
  }
}

function addNewAsset(ellipsis, asset, options) {
  const defaultDomain = ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID;
  const args = [ 
    { name: "name", value: asset.searchQuery },
    { name: "domain", value: defaultDomain }
  ];
  if (options.assetTypeId) {
    args.push({ name: "assetType", value: options.assetTypeId });
  }
  ellipsis.success({ isAddingNew: true }, {
    next: {
      actionName: "add-asset",
      args: args
    }
  });
}

function assetsMatching(ellipsis, searchQuery, options) {
  return new Promise((resolve, reject) => {
    CollibraApi(ellipsis).then(api => {
      api.findAssetTypeIdNamed(options.assetTypeName).then(assetTypeId => {
        api.findAsset(searchQuery).then(asset => {
          const idMatches = asset ? [asset] : [];
          const newOptions = Object.assign({}, options, { assetTypeId: assetTypeId });
          api.matchingAssets(searchQuery, newOptions).then(matches => {
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

function addableAssetsMatching(ellipsis, searchQuery, options) {
  return new Promise((resolve, reject) => {
    assetsMatching(ellipsis, searchQuery, options).then( matches => {
      resolve(matches.concat(extraOptionsFor(matches, searchQuery, options)));
    });
  });
}

function extraOptionsFor(matches, searchQuery, options) {
  const exactMatch = matches.find(ea => ea.label.toLowerCase().trim() === searchQuery.toLowerCase().trim());
  if (exactMatch) {
    return [];
  } else {
    const addTypeText = options.assetTypeName || "asset";
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
     