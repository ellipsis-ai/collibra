function(assetId, shouldStart, ellipsis) {
  if (shouldStart) {
  ellipsis.success("", {
    next: {
      actionName: "start-approval",
      args: [ { name: "asset", value: assetId } ]
    }
  });
} else {
  ellipsis.success("OK. You can start an approval by typing `…start approval for <asset name>`");
}
}
