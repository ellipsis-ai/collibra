function(task, shouldComplete, ellipsis) {
  const workflowTask = require('workflow-task')(ellipsis);

if (shouldComplete) {
  workflowTask(task);
} else {
  ellipsis.success("OK, maybe some other time.")
}
}
