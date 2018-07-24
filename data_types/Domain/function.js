function(ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.allDomains().then(domains => {
    ellipsis.success(domains.map(ea => {
      return {
        id: ea.id,
        label: `${ea.name}`
      };
    }));
  });
});
}
