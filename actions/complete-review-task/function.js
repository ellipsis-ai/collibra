function(task, action, comment, ellipsis) {
  const workflowHelpers = require('workflow-helpers')(ellipsis);

const formProperties = {
  comment: comment,
  approve: (action.id.toLowerCase() == "approve"),
  reject: (action.id.toLowerCase() == "reject")
};
workflowHelpers.completeTaskAndProceed(task, formProperties);
}
