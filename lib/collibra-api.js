/*
@exportId yt-z_2HAQgaw0xKqWsKlsQ
*/
module.exports = (function() {
const request = require('request');
const getSessionToken = require('session-token');
const baseUrl = "https://training-demo-53.collibra.com";
const apiBaseUrl = `${baseUrl}/rest/2.0`;

return ellipsis => {
  
  return {
    apiCall: apiCall,
    linkForAsset: linkForAsset,
    matchingAssets: matchingAssets,
    definitionAttributesFor: definitionAttributesFor,
    addDefinition: addDefinition
  };
  
  function apiCall(endpoint, options, resultFn) {
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
  }
  
  function linkForAsset(assetId) {
    return `${baseUrl}/asset/${assetId}`;
  }
  
  function addDefinition(assetId, definition) {
    return definitionAttributeType().then(definitionAttrType => {
      addAttribute(assetId, definitionAttrType.id, definition);
    });
  }
  
  function addAttribute(assetId, typeId, value) {
    return new Promise((resolve, reject) => {
      const data = {
        assetId: assetId,
        typeId: typeId,
        value: value
      };
      apiCall("attributes", { method: "POST", body: data }, (err, res, body) => {
        if (err) {
          reject(err);
        } else  if (res.statusCode != 201) {
          reject(`${res.statusCode}: ${body}`);
        } else {
          resolve(body);
        }
      });
    });
  }
  
  function matchingAssets(searchQuery) {
    return new Promise((resolve, reject) => {
      apiCall("assets", { qs: { name: searchQuery } }, (err, res, body) => {
        if (err) {
          reject(err);
        } else  if (res.statusCode != 200) {
          reject(`${res.statusCode}: ${body}`);
        } else {
          resolve(body.results);
        }
      });
    });
  }

  function definitionAttributesFor(assetId) {
    return new Promise((resolve, reject) => {
      definitionAttributeType().then( definitionAttrType => {
        const typeIds = [definitionAttrType.id];
        apiCall("attributes", { qs: { typeIds: typeIds, assetId: assetId } }, (err, res, body) => {
          if (err) {
            reject(err);
          } else  if (res.statusCode != 200) {
            reject(`${res.statusCode}: ${body}`);
          } else {
            resolve(body.results);
          }
        });
      });
    });
  }

  function definitionAttributeType() {
    return new Promise((resolve, reject) => {
      apiCall("attributeTypes", { qs: { name: "Definition", nameMatchMode: 'EXACT' } }, (err, res, body) => {
        if (err) {
          reject(err);
        } else  if (res.statusCode != 200) {
          reject(`${res.statusCode}: ${body}`);
        } else {
          resolve(body.results[0]);
        }
      });
    });
  }

};



})()
     