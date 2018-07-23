function(ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

collibra.findBusinessStewardRole().then(role => ellipsis.success(role.id));
}
