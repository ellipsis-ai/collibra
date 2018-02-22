function(ellipsis) {
  const moment = require('moment');
const getLogin = require('saved-login');
const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.listWorkflowTasks().then(res => {
  getLogin(ellipsis).then(login => {
    const tasks = res.results.map(ea => {
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
      tasks: tasks,
      username: login.username
    });
  });
});
}
