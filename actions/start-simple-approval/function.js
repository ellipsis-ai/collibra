function(asset, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  require('workflow-helpers')(ellipsis).then(workflowHelpers => {
    collibra.startSimpleApprovalWorkflowFor(asset.id).then(res => {
      if (res.success) {
        const message = `OK, I started a simple approval workflow for \`${asset.label}\`. `;
        const participantsMsg = "Everyone involved will be prompted for input as needed."
        collibra.nextTaskForAsset(asset.id).then(nextTask => {
          if (nextTask) {
            ellipsis.success(`${message}${participantsMsg}\n\nHere is the first task:`, {
              next: {
                actionName: "complete-task",
                args: [ { name: "task", value: nextTask.id }]
              }
            });
          } else {
            ellipsis.success(message);
          }
        });
      } else {
        const msg = `Sorry, I couldn't start this workflow yet.\n\n${res.error}`;
        workflowHelpers.addResponsibilityIfNec(res, msg, asset.id);
      }
    });
  });
});
}
