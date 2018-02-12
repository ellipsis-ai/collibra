function(ellipsis) {
  const CollibraApi = require('collibra-api');
const apiCall = CollibraApi(ellipsis);

apiCall("assets", { qs: { limit: 10 } }, (err, res, body) => {
  if (err) {
    ellipsis.error(err);
  } else if (res.statusCode == 200 ) {
    const count = body.total;
    const results = body.results;
    const firstTen = results.map(ea => ea.name);
    ellipsis.success({
      count: count,
      firstTen: firstTen
    });
  } else {
    ellipsis.error(res.statusCode);
  }
});
}
