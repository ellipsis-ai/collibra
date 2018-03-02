function(ellipsis) {
  const moment = require('moment');
const getLogin = require('saved-login');
const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.listWorkflowTasks().then(results => {
  getLogin(ellipsis).then(login => {
    const tasks = results.map(ea => {
      const link = api.linkFor("asset", ea.businessItem.id) + "#task-id=" + ea.id;
      return {
        id: ea.id,
        title: ea.title,
        description: ea.description,
        dueDate: moment(ea.dueDate).fromNow(),
        link: link
      };
    });
    ellipsis.success({
      isEmpty: tasks.length == 0,
      tasks: tasks,
      username: login.username
    });
  });
});

}
