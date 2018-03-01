function(task, shouldComplete, ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

if (shouldComplete) {
  api.completeTask(task.id, {}).then(res => {
    if (res.success) {
      ellipsis.success(":white_check_mark: OK, completed\n\n" + JSON.stringify(res.success));
    } else {
      ellipsis.success(`Sorry, I couldn't complete this task.\n\n${res.error}`)
    }
  });
} else {
  ellipsis.success("OK, maybe some other time.")
}
}
