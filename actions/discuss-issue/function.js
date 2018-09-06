function(issue, ellipsis) {
  ellipsis.success("", {
  next: {
    actionName: "start-discussing-issue",
    args: [ { name: "issueId", value: issue.id }]
  }
});
}
