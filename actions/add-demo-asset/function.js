function(ellipsis) {
  ellipsis.success("", {
  next: {
    actionName: "add-asset",
    args: [
      { name: "domain", value: ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID }
    ]
  }
});
}
