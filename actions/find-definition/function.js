function(asset, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

if (asset.id == "ellipsis-add-new") {
  addNewAsset();
} else if (asset.id == "ellipsis-search-again") {
  searchAgain();
} else {
  withChosenAsset();
}

function addNewAsset() {
  ellipsisApi.run({ 
    actionName: "add-asset",
    args: [ { name: "name", value: asset.searchQuery } ]
  }).then(ellipsis.noResponse);
}

function searchAgain() {
  ellipsisApi.say({ message: "OK, try searching again."}).then(res => {
    ellipsisApi.run({ 
      actionName: "find-definition"
    });
  }).then(ellipsis.noResponse);
}

function withChosenAsset() {
  collibra.definitionAttributesFor(asset.id).then(attrs => {
    const definitions = attrs.map(ea => ea.value.trim()).filter(ea => ea.length > 0);
    const hasDefinition = definitions.length > 0;
    if (hasDefinition) {
      ellipsis.success({
        name: asset.label,
        link: collibra.linkFor("asset", asset.id),
        hasDefinition: hasDefinition,
        definitions: definitions
      });
    } else {
      ellipsisApi.say({ message: `${asset.label} doesn't yet have a definition.`}).then(res => {
        ellipsisApi.run({ 
          actionName: "maybe-add-definition", 
          args: [ { name: "assetId", value: asset.id }, { name: "assetName", value: asset.label }] 
        });
      }).then(ellipsis.noResponse);
    }
  });
}
}
