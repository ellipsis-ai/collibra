function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

collibra.listWorkflowTasks().then(results => {
  if (results.length == 0) {
    ellipsis.success("You don't have any pending tasks right now. :thumbsup:\n\nCheck back later!");
  } else {
    ellipsisApi.say({ message: "You have some Collibra tasks in your queue…"}).then(res => {
      ellipsisApi.run({
        actionName: "complete-task"
      }).then(ellipsis.noResponse);
    });
  }
});
}
