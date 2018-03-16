function(asset, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);

collibra.startAssetApprovalWorkflowFor(asset.id).then(res => {
  if (res.success) {
    const message = `OK, I started an asset approval workflow for \`${asset.label}\`. `;
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
}
