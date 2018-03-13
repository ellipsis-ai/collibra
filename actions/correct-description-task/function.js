function(task, newDefinition, ellipsis) {
  const workflowHelpers = require('workflow-helpers')(ellipsis);
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

processDefinition().then(definitionUsed => {
  workflowHelpers.completeTaskAndProceed(task);
});

function processDefinition() {
  return new Promise((resolve, reject) => {
    if (newDefinition.trim() === "no change") {
      resolve(null);
    } else {
      const match = /^add:\s*(.*)$/i.exec(newDefinition);
      if (match) {
        collibra.definitionAttributesFor(task.assetId).then(attrs => {
          const definitions = (attrs.map(ea => ea.value.toString().trim()).filter(ea => ea.length > 0));
          const definitionToUse = `${definitions[0] ? definitions[0]+" " : ""}${match[1]}`;
          collibra.updateDefinition(task.assetId, definitionToUse).then(res => {
            resolve(definitionToUse);
          });
        });
      } else {
        collibra.updateDefinition(task.assetId, newDefinition).then(res => {
          resolve(newDefinition);
        }); 
      }
    }
  });
}
}
