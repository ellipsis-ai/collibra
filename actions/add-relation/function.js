function(sourceAsset, relationType, targetAsset, task, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);

collibra.addRelation(sourceAsset.id, targetAsset.id, relationType.id).then(res => {
  workflowHelpers.relationsTextFor(task.assetId, relationType.id).then(text => {
    ellipsis.success(`OK, I added the relation.\n\n${text}`, {
      next: {
        actionName: "maybe-add-relations-task",
        args: [ 
          { name: "task", value: task.id },
          { name: "relationTypeId", value: relationType.id }
        ]
      }
    });
  });
});
}
