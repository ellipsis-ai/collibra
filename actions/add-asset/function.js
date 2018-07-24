function(name, domain, assetType, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  collibra.addAsset(name, domain, assetType).then(res => {
    const newAssetId = res.id;
    const successResult = {
      assetLink: collibra.linkFor("asset", newAssetId),
      domainLink: collibra.linkFor("domain", domain.id),
      typeLink: collibra.linkFor("assettype", assetType.id)
    };

    ellipsis.success(successResult, {
      choices: [{ 
        label: "Add a definition now", 
        actionName: "add-definition", 
        args: [{ name: "asset", value: newAssetId }]
      }]
    });
  });
});
}
