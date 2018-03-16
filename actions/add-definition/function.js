function(asset, definition, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

collibra.addDefinition(asset.id, definition).then(res => {
  const link = collibra.linkFor("asset", asset.id);
  const msg = `OK, I set the definition of [${asset.label}](${link}) to be:\n> ${definition}`;
  ellipsis.success(msg, {
    next: {
      actionName: "maybe-start-approval",
      args: [{ name: "assetId", value: asset.id }]
    }
  });
});
}
