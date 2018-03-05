function(ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.listWorkflowDefinitions().then(definitions => {
  ellipsis.success(definitions.map(ea => {
    return {
      id: ea.id,
      label: ea.name
    };
  }));
});
}
