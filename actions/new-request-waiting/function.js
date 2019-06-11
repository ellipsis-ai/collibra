function(ellipsis) {
  // Write a Node.js (8.10) function that calls ellipsis.success() with a result.
// You can require any NPM package.
const name = ellipsis.event.user.fullName || "friend";
ellipsis.success(`
Hello, ${name}. You have a new dataset registration request waiting.

**[➡️ Go to task](https://dgc-koen-demo-dev.eu-west-1.lake.collibra.ai/tasks/my)**
`, {
  choices: [{
    label: "Reject",
    actionName: "demo-mock",
    args: [{
      name: "message",
      value: "OK, the task has been rejected."
    }]
  }, {
    label: "Re-assign",
    actionName: "demo-mock",
    args: [{
      name: "message",
      value: "OK, this task has been re-assigned."
    }]
  }, {
    label: "Discuss",
    actionName: "demo-mock",
    args: [{
      name: "message",
      value: "OK, I will open a discussion about this task."
    }]
  }]
});
}
