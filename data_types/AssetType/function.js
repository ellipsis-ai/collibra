function(ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.allAssetTypes().then(types => {
    ellipsis.success(types.map(ea => {
      return {
        id: ea.id,
        label: `${ea.name}`
      };
    }));
  }); 
});
}
