function(asset, role, user, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);
const EllipsisApi = require('ellipsis-api');
const ellipsisApi = new EllipsisApi(ellipsis);

collibra.addResponsibility(asset, role, user).then(res => {
  ellipsis.success();
});
}
