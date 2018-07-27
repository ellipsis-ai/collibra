function(name, domain, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.matchingAssets(name).then(matches => {
    ellipsis.success(matches[0]);
  });
});
}
