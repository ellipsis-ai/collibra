function(task, relationTypeId, action, ellipsis) {
  const workflowHelpers = require('workflow-helpers')(ellipsis);

if (action.id === "add") {
  ellipsis.success("", {
    next: {
      actionName: "add-relation",
      args: [
        { name: "sourceAsset", value: task.assetId },
        { name: "relationType", value: relationTypeId },
        { name: "task", value: task.id }
      ]
    }
  });
} else {
  workflowHelpers.completeTaskAndProceed(task);
}
}
