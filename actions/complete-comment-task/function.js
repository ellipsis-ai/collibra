function(task, comment, ellipsis) {
  const workflowHelpers = require('workflow-helpers')(ellipsis);

const formProperties = {
  comment: comment
};
workflowHelpers.completeTaskAndProceed(task, formProperties);
}
