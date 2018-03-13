function(assetId, shouldStart, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);

if (shouldStart) {
  ellipsisApi.run({
    actionName: "start-approval",
    args: [ { name: "asset", value: assetId } ]
  }).then(ellipsis.noResponse);
} else {
  ellipsis.success("OK. You can start an approval by typing `…start approval for <asset name>`");
}
}
