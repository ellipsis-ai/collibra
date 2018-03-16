function(assetId, shouldContinue, ellipsis) {
  if (shouldContinue) {
  ellipsis.success("", {
    next: {
      actionName: "add-definition",
      args: [ { name: "asset", value: assetId } ]
    }
  });
} else {
  ellipsis.success("OK, maybe later then :thumbsup:")
}
}
