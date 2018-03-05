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
    addResponsibilityIfNec: addResponsibilityIfNec
  };
  
  function completeTaskAndProceed(task, formProperties) {
    collibra.completeTask(task.id, formProperties || {}).then(res => {
      if (res.success) {
        collibra.listWorkflowTasks().then(tasks => {
          const nextTask = tasks.find(ea => ea.businessItem.id == task.assetId);
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
}
})()
     