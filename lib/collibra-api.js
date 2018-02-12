/*
@exportId yt-z_2HAQgaw0xKqWsKlsQ
*/
module.exports = (function() {
const request = require('request');
const getSessionToken = require('session-token');
const apiBaseUrl = "https://training-demo-53.collibra.com/rest/2.0";

return ellipsis => {
  return (endpoint, options, resultFn) => {
    getSessionToken(ellipsis).then(token => {
      const url = apiBaseUrl + "/" + endpoint;
      const defaultArgs = {
        url: url,
        json: true,
        headers: { "Cookie": `JSESSIONID=${token}` }
      };
      const args = Object.assign({}, defaultArgs, options);
      request(args, resultFn);
    });
  };
};


})()
     