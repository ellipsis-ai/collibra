function(task, comment, action, ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

const formProperties = {
  comment: comment,
  approve: (action.toLowerCase() == "approve"),
  reject: (action.toLowerCase() == "reject")
};
api.completeTask(task.id, formProperties).then(res => {
  ellipsis.success(JSON.stringify(res));
})
}
