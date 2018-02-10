function(ellipsis) {
  const request = require('request');
const getSessionToken = require('session-token');
const apiBaseUrl = "https://training-demo-53.collibra.com/rest/2.0";
const assetsEndpoint = "/assets";

getSessionToken(ellipsis).then(token => {
  request({ 
    url: apiBaseUrl + assetsEndpoint, 
    qs: { limit: 10 },
    json: true,
    headers: { "Cookie": `JSESSIONID=${token}` }
  }, (err, res, body) => {
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
});
}
