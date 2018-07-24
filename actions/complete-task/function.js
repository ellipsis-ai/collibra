function(task, ellipsis) {
  const CollibraApi = require('collibra-api');
const workflowHelpers = require('workflow-helpers')(ellipsis);
const formatAttribute = require('definition-helpers').textForAttribute;

CollibraApi(ellipsis).then(collibra => {
  workflowHelpers.markHasRunForTask(task.id).then(res => {
    if (task.type == "vote") {
      collibra.findAsset(task.assetId).then(asset => {
        messageFor(task.assetId).then(msg => {
          workflowHelpers.completeTaskWith(task, "complete-review-task", msg);
        });
      });
    } else {
      collibra.formForWorkflowTask(task.id).then(res => {
        const dontKnowResponse = `
  Sorry, I don't yet know how to deal with tasks of type \`{task.type}\`.

  Key: ${task.key}
  Description: ${task.description}

  Task form data:
  ${JSON.stringify(res)}
  `;
        ellipsis.success(dontKnowResponse);  
      })
    }
  });

  function messageFor(assetId) {
    return new Promise((resolve, reject) => {
      collibra.findAsset(assetId).then(asset => {
        collibra.definitionAttributesFor(asset.id).then(attrs => {
          const definitions = (attrs.map(formatAttribute).filter(ea => ea.length > 0));
          const link = collibra.linkFor("asset", asset.id);
          let text;
          if (definitions.length > 0) {
            const definitionsText = definitions.map(ea => "> " + ea).join("\n");
            text = `The asset [${asset.name}](${link}) has definitions:\n${definitionsText}`;
          } else {
            text = `The asset [${asset.name}](${link}) doesn't yet have any definitions`;
          }
          resolve(text);
        });
      });
    });
  }
});
}
