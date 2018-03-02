function(task, comment, ellipsis) {
  const workflowTask = require('workflow-task')(ellipsis);

const formProperties = {
  comment: comment
};
workflowTask(task, formProperties);
}
