function(ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(collibra => {
  const limit = 20;
  const defaultDomain = ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID;
  collibra.assetsInDomain(defaultDomain, limit).then(assets => {
    const list = assets.map(ea => {
      const link = collibra.linkFor("asset", ea.id);
      return {
        name: ea.name,
        link: link
      };
    });
    ellipsis.success({
      list: list,
      isLimited: list.length >= limit,
      limit: limit
    })
  });
});
}
