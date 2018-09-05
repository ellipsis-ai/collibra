function(issue, ellipsis) {
  ellipsis.success( { 
  permalink: ellipsis.userInfo.messageInfo.permalink || "https://example.com"
}, {
  next: {
    actionName: "start-discussing-issue"
  }
});
}
