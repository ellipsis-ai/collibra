function(task, comment, action, ellipsis) {
  const workflowTask = require('workflow-task')(ellipsis);

const formProperties = {
  comment: comment,
  approve: (action.id.toLowerCase() == "approve"),
  reject: (action.id.toLowerCase() == "reject")
};
workflowTask(task, formProperties);
}
