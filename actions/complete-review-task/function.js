function(task, action, comment, ellipsis) {
  require('workflow-helpers')(ellipsis).then(workflowHelpers => {
  const formProperties = {
    comment: comment,
    approve: (action.id.toLowerCase() == "approve"),
    reject: (action.id.toLowerCase() == "reject")
  };
  workflowHelpers.completeTaskAndProceed(task, formProperties);
});
}
