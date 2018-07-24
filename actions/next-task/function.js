function(ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  collibra.listWorkflowTasks().then(results => {
    if (results.length == 0) {
      ellipsis.success("You don't have any pending tasks right now. :thumbsup:\n\nCheck back later!");
    } else {
      ellipsis.success(":pick: You have some Collibra tasks in your queue…", {
        next: {
          actionName: "complete-task"
        }
      });
    }
  });
});
}
