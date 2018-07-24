function(task, comment, ellipsis) {
  require('workflow-helpers')(ellipsis).then(workflowHelpers => {
  const formProperties = {
    comment: comment
  };
  workflowHelpers.completeTaskAndProceed(task, formProperties);
});
}
