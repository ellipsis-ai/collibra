function(asset, workflowDefinition, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);

collibra.startWorkflow(asset.id, workflowDefinition.id).then(res => {
  if (res.success) {
    const message = `OK, I added a started workflow \`${workflowDefinition.label}\``;
    ellipsisApi.say({ message: message }).then(res => {
      collibra.nextTaskForAsset(asset.id).then(nextTask => {
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
    workflowHelpers.addResponsibilityIfNec(res, msg, asset.id);
  }
  
});
}
