function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);
const userId = ellipsis.userInfo ? ellipsis.userInfo.ellipsisUserId : null;

collibra.listWorkflowTasks().then(results => {
  if (results.length == 0) {
    ellipsis.noResponse();
  } else {
    const taskId = results[0].id;
    workflowHelpers.hasRunForTask(taskId).then(hasRun => {
      if (hasRun) {
        ellipsis.noResponse();
      } else {
        ellipsisApi.say({ message: "You have a Collibra task in your queue…"}).then(res => {
          ellipsisApi.run({
            actionName: "complete-task",
            args: [{ name: "task", value: taskId }]
          }).then(ellipsis.noResponse);
        });
      }
    });
  }
});
}
