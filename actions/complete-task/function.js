function(task, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

if (task.type == "vote") {
  collibra.findAsset(task.assetId).then(asset => {
    collibra.definitionAttributesFor(asset.id).then(attrs => {
      const definitions = attrs.map(ea => ea.value.toString().trim()).filter(ea => ea.length > 0);
      api.say({ message: messageFor(asset, definitions) }).then(res => {
        api.run({
          actionName: "complete-review-task",
          args: [ { name: "task", value: task.id } ]
        }).then(ellipsis.noResponse);
      });
    });
  });
} else if (task.key == "add_related_terms") {
  collibra.allRelationsForAsset(task.assetId).then(relations => {
    if (relations.length == 0) {
      completeSimpleTask("There aren't yet any relations for this asset");
    } else {
      const relationTypeIds = new Set(relations.map(ea => ea.type.id));
      Promise.all(Array.from(relationTypeIds).map(collibra.findRelationType)).then(relationTypes => {
        const text = relations.map(ea => "- " + relationStringFor(ea, relationTypes)).join("\n");
        completeSimpleTask(`Current relations:\n${text}`);
      });
    }
  });
} else if (task.formRequired != "true") {
  completeSimpleTask();     
} else if (task.type == "provide") {
  const msg = `To complete this task, you need to:\n\n${task.description}`
  api.say({ message: msg }).then(res => {
    api.run({
      actionName: "complete-comment-task",
      args: [ { name: "task", value: task.id } ]
    }).then(ellipsis.noResponse);  
  });     
} else {
  collibra.formForWorkflowTask(task.id).then(res => {
    ellipsis.success(JSON.stringify(res));  
  })
}

function relationStringFor(relation, relationTypes) {
  console.log(JSON.stringify(relationTypes));
  const relationType = relationTypes.find(ea => ea.id === relation.type.id);
  return `**${relation.source.name}** ${relationType.role} **${relation.target.name}**`;
}

function completeSimpleTask(taskSpecificText) {
  const link = collibra.linkFor("asset", task.assetId) + "#task-id=" + task.id;
  const msg = `
To complete this task, you need to ${task.description}${taskSpecificText ? "\n\n" + taskSpecificText : ""}

[More details](${link})
`
  return api.say({ message: msg }).then(res => {
    api.run({
      actionName: "complete-simple-task",
      args: [ { name: "task", value: task.id } ]
    }).then(ellipsis.noResponse);  
  });
}

function messageFor(asset, definitions) {
  const link = collibra.linkFor("asset", asset.id);      
  if (definitions.length > 0) {
    const definitionsText = definitions.map(ea => "> " + ea).join("\n");
    return `The asset [${asset.name}](${link}) has definitions:\n${definitionsText}`;
  } else {
    return `The asset [${asset.name}](${link}) doesn't yet have any definitions`;
  }
}
}
