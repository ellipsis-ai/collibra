function(sourceAsset, relationType, targetAsset, task, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);

collibra.addRelation(sourceAsset.id, targetAsset.id, relationType.id).then(res => {
  workflowHelpers.relationsTextFor(task.assetId).then(text => {
    ellipsisApi.say({ message: `OK, I added the relation.\n\n${text}` }).then(res => {
      ellipsisApi.run({
        actionName: "maybe-add-relations-task",
        args: [ { name: "task", value: task.id }]
      }).then(ellipsis.noResponse);
    });
  });
});
}
