function(ellipsis) {
  const moment = require('moment-timezone');
const getLogin = require('saved-login').getLoginForCurrentUser;
const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.listWorkflowTasks().then(results => {
    getLogin(ellipsis).then(login => {
      Promise.all(results.map(ea => dataForTask(ea))).then(tasks => {
        ellipsis.success({
          isEmpty: tasks.length == 0,
          tasks: tasks,
          username: login.username
        });
      });
    });
  });
  
  function dataForTask(task) {
    return api.findAsset(task.businessItem.id).then(asset => {
      const link = api.linkFor("asset", task.businessItem.id) + "#task-id=" + task.id;
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: moment(task.dueDate).fromNow(),
        link: link,
        assetName: asset.name
      };
    });
  }
});
}
