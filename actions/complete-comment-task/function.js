function(task, comment, ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

const formProperties = {
  comment: comment
};
api.completeTask(task.id, formProperties).then(res => {
  if (res.success) {
    ellipsis.success(":white_check_mark: OK, completed\n\n" + JSON.stringify(res.success));
  } else {
    ellipsis.success(`Sorry, I couldn't complete this task.\n\n${res.error}`)
  }
  ellipsis.success(JSON.stringify(res));
})
}
