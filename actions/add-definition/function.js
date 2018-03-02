function(asset, definition, ellipsis) {
  const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

collibra.addDefinition(asset.id, definition).then(res => {
  ellipsis.success({
    link: collibra.linkFor("asset", asset.id)
  });
});

}
