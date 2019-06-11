function(issue, ellipsis) {
  ellipsis.success("OK, let's get started…", {
  next: {
    actionName: "discuss-issue",
    args: [{ name: "issue", value: issue.id }]
  }
});
}
