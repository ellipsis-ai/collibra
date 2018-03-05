function(task, shouldComplete, ellipsis) {
  const workflowHelpers = require('workflow-helpers')(ellipsis);

if (shouldComplete) {
  workflowHelpers.completeTaskAndProceed(task);
} else {
  ellipsis.success("OK, maybe some other time.")
}
}
