function(asset, role, user, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

collibra.addResponsibility(asset, role, user).then(res => {
  collibra.listWorkflowTasks().then(tasks => {
    const nextTask = tasks.find(ea => ea.businessItem.id == asset.id);
    if (nextTask) {
      ellipsis.success(":white_check_mark: OK, on to the next task…", {
        next: {
          actionName: "complete-task",
          args: [ { name: "task", value: nextTask.id }]
        }
      });
    } else {
      ellipsis.success("", {
        next: {
          actionName: "start-approval",
          args: [ { name: "asset", value: asset.id }]
        }
      });
    }
  });
});
}
