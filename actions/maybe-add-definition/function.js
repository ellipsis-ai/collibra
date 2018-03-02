function(assetId, shouldContinue, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);

if (shouldContinue) {
  ellipsisApi.run({
    actionName: "add-definition",
    args: [ { name: "asset", value: assetId } ]
  }).then(ellipsis.noResponse);
} else {
  ellipsis.success("OK, maybe later then :thumbsup:")
}

}
