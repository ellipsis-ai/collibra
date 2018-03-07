/*
@exportId M1e-XnIHQ261UHpXO1a_WA
*/
module.exports = (function() {
const CollibraApi = require('collibra-api');
const EllipsisApi = require('ellipsis-api');

return ellipsis => {
  const collibra = CollibraApi(ellipsis);
  const api = new EllipsisApi(ellipsis);
  
  return {
    completeTaskAndProceed: completeTaskAndProceed,
    addResponsibilityIfNec: addResponsibilityIfNec,
    relationsTextFor: relationsTextFor,
    commentsTextFor: commentsTextFor,
    completeTaskWith: completeTaskWith,
    completeSimpleTask: completeSimpleTask
  };
  
  function completeTaskAndProceed(task, formProperties) {
    collibra.completeTask(task.id, formProperties || {}).then(res => {
      if (res.success) {
        collibra.nextTaskForAsset(task.assetId).then(nextTask => {
          let options = {
            actionName: "complete-task"
          };
          let msg = ":white_check_mark: OK, got it!";
          if (nextTask) {
            options = Object.assign({}, options, {
              args: [ { name: "task", value: nextTask.id }]
            });
            msg = ":white_check_mark: OK, on to the next task…";
          }
          api.say({ message: msg }).then(res => {
            api.run(options).then(ellipsis.noResponse);
          });
        });
      } else {
        const msg = `Sorry, I couldn't complete this task.\n\n${res.error}`;
        addResponsibilityIfNec(res, msg, task.assetId);
      }
    });
  }
  
  function addResponsibilityIfNec(res, msg, assetId) {
    const responsibilityRegex = /A user for role '([^']+)' for '([^']+)' was not found/;
    let match;
    if (res.status == 400 && res.body && (match = responsibilityRegex.exec(res.body.userMessage))) {
      collibra.allRoles().then(roles => {
        const role = roles.find(ea => ea.name == match[1]);
        api.say({ message: msg }).then(res => {
          api.run({
            actionName: "add-responsibility",
            args: [
              { name: "asset", value: assetId },
              { name: "role", value: role.id }
            ]
          }).then(ellipsis.noResponse);
        });
      });
    } else {
      ellipsis.success(msg);
    }
  }
  
  function relationStringFor(relation, role) {
    return `**${relation.source.name}** ${role} **${relation.target.name}**`;
  }
  
  function relationsTextFor(assetId, relationTypeId) {
    return new Promise((resolve, reject) => {
      collibra.allRelationsForAsset(assetId, relationTypeId).then(relations => {
        collibra.findRelationType(relationTypeId).then(relationType => {
          const actionName = "maybe-add-relations-task";
          const role = relationType.role;
          const assetLink = collibra.linkFor("asset", assetId);
          if (relations.length == 0) {
            resolve(`There aren't yet any \`${role}\` relations for [this asset](${assetLink})`);
          } else {
            const text = relations.map(ea => "- " + relationStringFor(ea, role)).join("\n");
            resolve(`Current \`${role}\` relations for [this asset](${assetLink}):\n${text}`);
          }
        });
      });
    });
  }
  
  function commentsTextFor(task) {
    return new Promise((resolve, reject) => {
      collibra.allCommentsFor(task.assetId).then(comments => {
        const link = collibra.linkFor("asset", task.assetId) + "#task-id=" + task.id;
        const commentsList = comments.map(ea => `\n- ${ea.content}`).join("");
        resolve(`Comments:${commentsList}\n\nSee [the asset](${link}) for more details.`);
      });
    });  
  }
  
  function completeTaskWith(task, actionName, taskSpecificText, otherArgs) {
    const msg = `
  To complete this task:\n\n${task.description}${taskSpecificText ? "\n\n" + taskSpecificText : ""}
  `
    return api.say({ message: msg }).then(res => {
      api.run({
        actionName: actionName,
        args: [ { name: "task", value: task.id } ].concat(otherArgs || [])
      }).then(ellipsis.noResponse);  
    });
  }
  
  function completeSimpleTask(task, taskSpecificText) {
    return completeTaskWith(task, "complete-simple-task", taskSpecificText);
  }
  
}
})()
     