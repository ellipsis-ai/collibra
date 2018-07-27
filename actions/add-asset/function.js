function(name, domain, assetType, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  collibra.addAsset(name, domain, assetType).then(res => {
    const newAssetId = res.id;
    const data = {
      assetLink: collibra.linkFor("asset", newAssetId),
      domainLink: collibra.linkFor("domain", domain.id),
      typeLink: collibra.linkFor("assettype", assetType.id)
    };
    const successResult = `
OK, I added a new asset [${name}](${data.assetLink})
> in domain [${domain.label}](${data.domainLink})
> of type [${assetType.label}](${data.typeLink})

If you like, you can add a definition for this asset now.
`;
    ellipsis.success(successResult, {
      choices: [{ 
        label: "Add a definition now", 
        actionName: "add-definition", 
        args: [{ name: "asset", value: newAssetId }]
      }]
    });
  }).catch(err => {
    if (err.errorCode === "termAlreadyExists") {
      ellipsis.success(`You can't add a new asset of type ${assetType.label} with name "${name}".`, {
        next: {
          actionName: "asset-already-exists",
          args: [
            { name: "name", value: name },
            { name: "domain", value: domain.id }
          ]
        }
      })
    } else {
      ellipsis.error(err, { userMessage: err.userMessage });
    }
  });
});
}
