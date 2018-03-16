function(name, domain, assetType, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

collibra.addAsset(name, domain, assetType).then(res => {
  const newAssetId = res.id;
  const typeLink = collibra.linkFor("assettype", assetType.id);
  const domainLink = collibra.linkFor("domain", domain.id);
  const assetLink = collibra.linkFor("asset", newAssetId);
  const message = `
OK, I added a new asset [${name}](${assetLink})
> in domain [${domain.label}](${domainLink})
> of type [${assetType.label}](${typeLink})
`;
  
  ellipsis.success(message, {
    next: {
      actionName: "maybe-add-definition",
      args: [ { name: "assetId", value: newAssetId } ]
    }
  });
});
}
