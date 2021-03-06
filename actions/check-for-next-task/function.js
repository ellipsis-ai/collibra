function(ellipsis) {
  const CollibraApi = require('collibra-api');
const workflowHelpers = require('workflow-helpers');
const userId = ellipsis.userInfo ? ellipsis.userInfo.ellipsisUserId : null;

CollibraApi(ellipsis).then(collibra => {
  collibra.listWorkflowTasks().then(results => {
    if (results.length == 0) {
      if (ellipsis.event.originalEventType === "scheduled") {
        ellipsis.noResponse();
      } else {
        ellipsis.success("You have no tasks in your queue at the moment :thumbsup:")
      }
    } else {
      const taskId = results[0].id;
      workflowHelpers(ellipsis).then(wf => {
        wf.hasRunForTask(taskId).then(hasRun => {
          if (hasRun) {
            ellipsis.noResponse();
          } else {
            ellipsis.success(":pick: You have a Collibra task in your queue…", {
              next: {
                actionName: "complete-task",
                args: [{ name: "task", value: taskId }]
              }
            });
          }
        });
      });
    }
  });
});
}
