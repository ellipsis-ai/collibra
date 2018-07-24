function(task, shouldComplete, ellipsis) {
  require('workflow-helpers')(ellipsis).then(workflowHelpers => {
  if (shouldComplete) {
    workflowHelpers.completeTaskAndProceed(task);
  } else {
    ellipsis.success("OK, maybe some other time.")
  } 
});
}
