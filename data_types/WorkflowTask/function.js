function(ellipsis) {
  const moment = require('moment-timezone');
const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.listWorkflowTasks().then(results => {
    Promise.all(results.map(ea => {
      return api.findAsset(ea.businessItem.id).then(asset => {
        return { task: ea, asset: asset };
      });
    })).then(resultsWithAssets => {
      ellipsis.success(resultsWithAssets.map(ea => {
        const task = ea.task;
        const dueString = moment(task.dueDate).fromNow();
        const label = `${ea.asset.name}: ${task.description} (due ${dueString})`
        return {
          id: task.id,
          label: label,
          type: task.type,
          description: task.description,
          assetId: task.businessItem.id,
          formRequired: task.formRequired.toString(),
          key: task.key
        };
      }));
    });
  });
});
}
