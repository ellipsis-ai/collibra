function(task, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const workflowHelpers = require('workflow-helpers')(ellipsis);
const formatAttribute = require('definition-helpers').textForAttribute;

workflowHelpers.markHasRunForTask(task.id).then(res => {
  if (task.type == "vote") {
    collibra.findAsset(task.assetId).then(asset => {
      messageFor(task.assetId).then(msg => {
        workflowHelpers.completeTaskWith(task, "complete-review-task", msg);
      });
    });
  } else if (task.key == "add_related_terms") {
    collibra.relationTypesWithRole("Related to").then(types => {
      const relatedToId = types[0] ? types[0].id : null;
      workflowHelpers.relationsTextFor(task.assetId, relatedToId).then(text => {
        const args = relatedToId ? [{ name: "relationTypeId", value: relatedToId }] : [];
        workflowHelpers.completeTaskWith(task, "maybe-add-relations-task", text, args);
      });
    });
  } else if (task.key == "add_policies" || task.key == "add_complied_policies") {
    collibra.relationTypesWithRole("Complies to").then(types => {
      const compliesToId = types[0] ? types[0].id : null;
      workflowHelpers.relationsTextFor(task.assetId, compliesToId).then(text => {
        const args = compliesToId ? [{ name: "relationTypeId", value: compliesToId }] : [];
        workflowHelpers.completeTaskWith(task, "maybe-add-relations-task", text, args);
      });
    });
  } else if (task.key == "address_comments") {
    workflowHelpers.commentsTextFor(task).then(commentsText => {
      workflowHelpers.completeSimpleTask(task, commentsText);
    });
  } else if (task.key == "correct_description") {
    workflowHelpers.commentsTextFor(task).then(commentsText => {
      messageFor(task.assetId).then(msg => {
        const text = `${msg}\n\n${commentsText}`;
        workflowHelpers.completeTaskWith(task, "correct-description-task", text);  
      });
    })
  } else if (task.key == "provide_comment") {
    collibra.relationTypesWithRole("Complies to").then(types => {
      const compliesToId = types[0] ? types[0].id : null;
      workflowHelpers.relationsTextFor(task.assetId, compliesToId).then(text => {
        workflowHelpers.completeTaskWith(task, "complete-comment-task", text);   
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
}
