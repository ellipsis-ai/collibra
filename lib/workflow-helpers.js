/*
@exportId M1e-XnIHQ261UHpXO1a_WA
*/
module.exports = (function() {
const EllipsisApi = require('ellipsis-api');
const CollibraApi = require('collibra-api');

return ellipsis => {
  const collibra = CollibraApi(ellipsis);
  const userId = ellipsis.userInfo ? ellipsis.userInfo.ellipsisUserId : null;
  
  return {
    completeTaskAndProceed: completeTaskAndProceed,
    addResponsibilityIfNec: addResponsibilityIfNec,
    relationsTextFor: relationsTextFor,
    commentsTextFor: commentsTextFor,
    completeTaskWith: completeTaskWith,
    completeSimpleTask: completeSimpleTask,
    hasRunForTask: hasRunForTask,
    markHasRunForTask: markHasRunForTask
  };
  
  function completeTaskAndProceed(task, formProperties) {
    collibra.completeTask(task.id, formProperties || {}).then(res => {
      if (res.success) {
        collibra.nextTaskForAsset(task.assetId).then(nextTask => {
          if (nextTask) {
            ellipsis.success(":white_check_mark: OK, on to the next task…", {
              next: {
                actionName: "complete-task",
                args: [ { name: "task", value: nextTask.id }]
              }
            });
          } else {
            ellipsis.success(":white_check_mark: OK, got it! Talk to you later.");
          }
        });
      } else {
        const msg = `Sorry, I couldn't complete this task.\n\n${res.error}`;
        addResponsibilityIfNec(res, msg, task.assetId, formProperties);
      }
    });
  }
  
  function addResponsibilityIfNec(res, msg, assetId, formProperties) {
    const responsibilityRegex = /A user for role '([^']+)' for '([^']+)' was not found/;
    let match;
    if (res.status == 400 && res.body && (match = responsibilityRegex.exec(res.body.message || res.body.userMessage))) {
      collibra.allRoles().then(roles => {
        const role = roles.find(ea => ea.name == match[1]);
        ellipsis.success(`${msg}\n\nI'll help you take care of this in a moment…`, {
          next: {
            actionName: "add-responsibility",
            args: [
              { name: "asset", value: assetId },
              { name: "role", value: role.id }
            ]
          }
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
            resolve(`There aren't yet any \`${role}\` relations for [this asset](${assetLink})\nI can help you with that…`);
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
    const msg = `Task: **${task.description}**\n\n${taskSpecificText ? "\n\n" + taskSpecificText : ""}`;
    ellipsis.success(msg, {
      next: {
        actionName: actionName,
        args: [ { name: "task", value: task.id } ].concat(otherArgs || [])
      }
    });
  }
  
  function completeSimpleTask(task, taskSpecificText) {
    return completeTaskWith(task, "complete-simple-task", taskSpecificText);
  }
  
  function hasRunForTask(taskId) {
    return new Promise((resolve, reject) => {
      const storageApi = new EllipsisApi(ellipsis).storage;

      const query = `
      query GetTaskStarted($filter: TaskStartedInput!) {

          taskStartedList(filter: $filter) {
            id
            taskId
            userId
          }

        }
      `;

      const vars = { filter: { taskId: taskId, userId: userId } };
      return storageApi.query({query: query, variables: vars }).then(res => {
        if (res.data) {
          resolve(res.data.taskStartedList.length > 0);
        } else {
          reject(new ellipsis.Error(`Error checking task started: ${JSON.stringify(res.errors)}`, { userMessage: "An error occurred while checking whether a task was started." }));
        }
      });
    });
  }


  function markHasRunForTask(taskId) {
    return new Promise((resolve, reject) => {
      const storageApi = new EllipsisApi(ellipsis).storage;

      const mutation = `
      mutation CreateTaskStarted($taskStarted: TaskStartedInput!) {

        createTaskStarted(taskStarted: $taskStarted) {
          id
          taskId
          userId
        }

      }
    `;

      const vars = { taskStarted: { taskId: taskId, userId: userId } };
      return storageApi.query({query: mutation, variables: vars }).then(res => {
        if (res.data) {
          resolve(res.data.createTaskStarted);
        } else {
          reject(new ellipsis.Error(`Error created task started: ${JSON.stringify(res.errors)}`, { userMessage: "An error occurred while trying to start a task."}));
        }
      });
    });
  }
  
}
})()
     