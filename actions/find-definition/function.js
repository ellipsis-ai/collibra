function(asset, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const formatAttribute = require('definition-helpers').textForAttribute;

if (asset.id == "ellipsis-add-new") {
  addNewAsset();
} else {
  withChosenAsset();
}

function addNewAsset() {
  const defaultDomain = ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID;
  ellipsis.success({ isAddingNew: true }, {
    next: {
      actionName: "add-asset",
      args: [ 
        { name: "name", value: asset.searchQuery },
        { name: "domain", value: defaultDomain }
      ]
    }
  });
}

function withChosenAsset() {
  collibra.definitionAttributesFor(asset.id).then(attrs => {
    const definitions = attrs.map(formatAttribute).filter(ea => ea.length > 0);
    const hasDefinition = definitions.length > 0;
    const successResult = {
      isAddingNew: false,
      name: asset.label,
      link: collibra.linkFor("asset", asset.id),
      hasDefinition: hasDefinition,
      definitions: definitions
    };
    const options = hasDefinition ? {} : {
      next: {
          actionName: "maybe-add-definition", 
          args: [ { name: "assetId", value: asset.id }, { name: "assetName", value: asset.label }]
        }
      };
    ellipsis.success(successResult, options);
  });
}
}
