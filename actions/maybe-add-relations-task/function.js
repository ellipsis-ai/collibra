function(task, action, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);

if (action.id === "add") {
  ellipsisApi.run({ 
    actionName: "add-relation", 
    args: [
      { name: "sourceAsset", value: task.assetId },
      { name: "task", value: task.id }
    ] 
  }).then(ellipsis.noResponse);
} else {
  workflowHelpers.completeTaskAndProceed(task);
}
}
