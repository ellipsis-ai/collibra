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
    addAsset: addAsset,
    allAssetTypes: allAssetTypes,
    allDomains: allDomains,
    linkFor: linkFor,
    findAsset: findAsset,
    matchingAssets: matchingAssets,
    definitionAttributesFor: definitionAttributesFor,
    addDefinition: addDefinition,
    listWorkflowTasks: listWorkflowTasks
  };
  
  function apiCall(endpoint, options, resultFn) {
    getSessionToken(ellipsis).then(token => {
      const url = apiBaseUrl + "/" + endpoint;
      const defaultArgs = {
        url: url,
        json: true,
        headers: { "Cookie": `JSESSIONID=${token.token}` }
      };
      const args = Object.assign({}, defaultArgs, options);
      request(args, resultFn);
    }).catch(err => {
      ellipsis.error(err);
    });
  }
  
  function listWorkflowTasks() {
    return new Promise((resolve, reject) => {
      apiCall("workflowTasks", { qs: { sortOrder: 'ASC' } }, (err, res, body) => {
        if (err) {
            reject(err);
          } else  if (res.statusCode != 200) {
            reject(`${res.statusCode}: ${body}`);
          } else {
            resolve(body);
          }
      });
    });
  }
  
  function addAsset(name, domain, assetType) {
    return new Promise((resolve, reject) => {
      const data = {
        name: name,
        typeId: assetType.id,
        domainId: domain.id
      };
      apiCall("assets", { method: "POST", body: data }, (err, res, body) => {
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
  
  function allAssetTypes() {
    return new Promise((resolve, reject) => {
      apiCall("assetTypes", {}, (err, res, body) => {
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
  
  function allDomains() {
    return new Promise((resolve, reject) => {
      apiCall("domains", {}, (err, res, body) => {
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
  
  function linkFor(path, id) {
    return `${baseUrl}/${path}/${id}`;
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
  
  function findAsset(assetId) {
    return new Promise((resolve, reject) => {
      apiCall(`assets/${assetId}`, { }, (err, res, body) => {
        if (err) {
          reject(err);
        } else if (res.statusCode == 200) {
          resolve(body);
        } else if (res.statusCode == 404) {
          resolve(null);
        } else {
          reject(`${res.statusCode}: ${body}`);
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
     