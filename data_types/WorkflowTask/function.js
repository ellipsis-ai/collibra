function(ellipsis) {
  const moment = require('moment');
const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.listWorkflowTasks().then(results => {
  ellipsis.success(results.map(ea => {
    const dueString = moment(ea.dueDate).fromNow();
    const label = `${ea.description} (due ${dueString})`
    return {
      id: ea.id,
      label: label,
      type: ea.type,
      description: ea.description,
      assetId: ea.businessItem.id,
      formRequired: ea.formRequired.toString()
    };
  }));
});
}
