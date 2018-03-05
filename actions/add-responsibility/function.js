function(asset, role, user, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);

collibra.addResponsibility(asset, role, user).then(res => {
  collibra.listWorkflowTasks().then(tasks => {
    const nextTask = tasks.find(ea => ea.businessItem.id == asset.id);
    if (nextTask) {
      ellipsisApi.say({ message: ":white_check_mark: OK, on to the next task…" }).then(res => {
        ellipsisApi.run({
          actionName: "complete-task",
          args: [ { name: "task", value: nextTask.id }]
        }).then(ellipsis.noResponse);
      });
    } else {
        ellipsis.success();
    }
  });
});
}
