function(asset, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);

collibra.startAssetApprovalWorkflowFor(asset.id).then(res => {
  if (res.success) {
    const message = `OK, I started an asset approval workflow for \`${asset.label}\`. `;
    const participantsMsg = "Everyone involved will be prompted for input as needed."
    collibra.nextTaskForAsset(asset.id).then(nextTask => {
      if (nextTask) {
        ellipsisApi.say({ message: message + participantsMsg }).then(res => {
          ellipsisApi.say({ message: "Here is the first task:" }).then(res => {
            ellipsisApi.run({
              actionName: "complete-task",
              args: [ { name: "task", value: nextTask.id }]
            }).then(ellipsis.noResponse);
          });
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
