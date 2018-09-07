function(issue, ellipsis) {
  ellipsis.success("", {
  next: {
    actionName: "discuss-issue",
    args: [ { name: "issue", value: issue.id }]
  }
});
}
