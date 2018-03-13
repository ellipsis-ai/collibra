function(asset, definition, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);

collibra.addDefinition(asset.id, definition).then(res => {
  const link = collibra.linkFor("asset", asset.id);
  const msg = `OK, I set the definition of [${asset.label}](${link}) to be:\n> ${definition}`;
  ellipsisApi.say({ message: msg }).then(res => {
    ellipsisApi.run({
      actionName: "maybe-start-approval",
      args: [{ name: "assetId", value: asset.id }]
    }).then(ellipsis.noResponse);
  });
});
}
