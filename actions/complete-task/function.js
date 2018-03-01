function(task, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

const simpleTaskTypes = ["correct", "add"];

if (task.type == "vote") {
  api.run({
    actionName: "complete-review-task",
    args: [ { name: "task", value: task.id } ]
  }).then(ellipsis.noResponse);
} else if (simpleTaskTypes.indexOf(task.type) >= 0) {
  const link = collibra.linkFor("asset", task.assetId) + "#task-id=" + task.id;
  const msg = `To complete this task, you need to:\n\n${task.description}\n\n${link}`
  api.say({ message: msg }).then(res => {
    api.run({
      actionName: "complete-simple-task",
      args: [ { name: "task", value: task.id } ]
    }).then(ellipsis.noResponse);  
  });     
} else {
  collibra.formForWorkflowTask(task.id).then(res => {
    ellipsis.success(JSON.stringify(res));  
  })
}
}
