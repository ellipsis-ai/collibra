function(asset, definition, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

collibra.addDefinition(asset.id, definition).then(res => {
  const successResult = {
    link: collibra.linkFor("asset", asset.id)
  };
  ellipsis.success(successResult, {
    choices: [{
      label: "Start approval process now",
      actionName: "start-approval",
      args: [{ name: "asset", value: asset.id }]
    }]
  });
});
}
