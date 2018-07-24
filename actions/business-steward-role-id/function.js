function(ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  collibra.findBusinessStewardRole().then(role => ellipsis.success(role.id));
});
}
