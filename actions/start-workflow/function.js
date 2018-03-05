function(asset, workflowDefinition, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);

collibra.startWorkflow(asset.id, workflowDefinition.id).then(res => {
  if (res.success) {
    const message = `OK, I added a started workflow \`${workflowDefinition.label}\``;
    ellipsisApi.say({ message: message }).then(res => {
      collibra.listWorkflowTasks().then(tasks => {
        const nextTask = tasks.find(ea => ea.businessItem.id == asset.id);
        if (nextTask) {
          ellipsisApi.say({ message: "Here is the first task:" }).then(res => {
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
  } else {
    const msg = `Sorry, I couldn't start this workflow yet.\n\n${res.error}`;
    const responsibilityRegex = /A user for role '([^']+)' for '([^']+)' was not found/;
    let match;
    if (res.status == 400 && res.body && (match = responsibilityRegex.exec(res.body.userMessage))) {
      collibra.allRoles().then(roles => {
        const role = roles.find(ea => ea.name == match[1]);
        ellipsisApi.say({ message: msg }).then(res => {
          ellipsisApi.run({
            actionName: "add-responsibility",
            args: [
              { name: "asset", value: asset.id },
              { name: "role", value: role.id }
            ]
          }).then(ellipsis.noResponse);
        });
      });
    } else {
      ellipsis.success(msg);
    }
  }
  
});
}
