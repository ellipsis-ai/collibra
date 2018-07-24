function(ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.listWorkflowDefinitions().then(definitions => {
    ellipsis.success(definitions.map(ea => {
      return {
        id: ea.id,
        label: ea.name
      };
    }));
  });
});
}
