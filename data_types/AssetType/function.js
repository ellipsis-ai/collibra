function(ellipsis) {
  const CollibraApi = require('collibra-api');
const api = CollibraApi(ellipsis);

api.allAssetTypes().then(types => {
  ellipsis.success(types.map(ea => {
    return {
      id: ea.id,
      label: `${ea.name}`
    };
  }));
});
}
