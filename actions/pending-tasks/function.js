function(ellipsis) {
  const moment = require('moment');
const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.listWorkflowTasks().then(tasks => {
  ellipsis.success(tasks.results.map(ea => {
    const link = api.linkFor("asset", ea.businessItem.id) + "#task-id=" + ea.id;
    return {
      id: ea.id,
      title: ea.title,
      description: ea.description,
      dueDate: moment(ea.dueDate).fromNow(),
      link: link
    };
  }));
});
}
