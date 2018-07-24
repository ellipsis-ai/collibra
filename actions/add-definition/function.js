function(asset, definition, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  collibra.addDefinition(asset.id, definition).then(res => {
    const successResult = {
      link: collibra.linkFor("asset", asset.id)
    };
    const args = [{ name: "asset", value: asset.id }];
    ellipsis.success(successResult, {
      choices: [
        {
          label: "Start simple approval process",
          actionName: "start-simple-approval",
          args: args      
        }
      ]
    });
  });
});
}
