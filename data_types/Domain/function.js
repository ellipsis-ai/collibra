function(ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.allDomains().then(domains => {
  ellipsis.success(domains.map(ea => {
    return {
      id: ea.id,
      label: `${ea.name}`
    };
  }));
});
}
