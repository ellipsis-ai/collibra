/*
@exportId yt-z_2HAQgaw0xKqWsKlsQ
*/
module.exports = (function() {
const request = require('request');
const getSessionToken = require('session-token');
const baseUrl = "https://pieter.collibra.com";
const apiBaseUrlV1 = `${baseUrl}/rest/1.0`
const apiBaseUrlV2 = `${baseUrl}/rest/2.0`;

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
    listWorkflowTasks: listWorkflowTasks,
    formForWorkflowTask: formForWorkflowTask,
    completeTask: completeTask
  };
  
  function apiCall(endpoint, options, resultFn, apiBaseUrlOverride) {
    const apiBaseUrl = apiBaseUrlOverride || apiBaseUrlV2;
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
  
  function handleResponse(resolve, reject, statusHandler) {
    return (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        const status = res.statusCode;
        if (status == 200 || status == 201) {
          resolve(body);
        } else {
          if (statusHandler) {
            statusHandler(status, res, body);
          } else {
            reject(`${status}: ${JSON.stringify(body)}`);
          }
        }
      }
    };
  }
  
  function formForWorkflowTask(taskId) {
    return new Promise((resolve, reject) => {
      const path = `workflow/task/${taskId}/form`;
      apiCall(path, { qs: { } }, handleResponse(resolve, reject), apiBaseUrlV1);
    });
  }
  
  function listWorkflowTasks() {
    return new Promise((resolve, reject) => {
      getCurrentUser().then(user => {
        apiCall(
          "workflowTasks", 
          { qs: { sortOrder: 'ASC', userId: user.id } }, 
          handleResponse(res => resolve(res.results), reject)
        );
      });
    });
  }
  
  function completeTask(taskId, formProperties) {
    return new Promise((resolve, reject) => {
      const data = {
        taskIds: [taskId],
        formProperties: formProperties
      };
      const success = res => resolve({ success: res });
      apiCall(
        "workflowTasks/completed", 
        { method: "POST", body: data }, 
        handleResponse(
          success, 
          reject, 
          (status, res, body) => {
            if (status == 400) {
              resolve({ error: `${body.titleMessage}: ${body.userMessage}\n\n${body.helpMessage}` });
            } else {
              handleResponse(success, reject)
            }
          }
        )
      );
    });
  }

  function getCurrentUser() {
    return new Promise((resolve, reject) => {
      apiCall(
        "users/current", 
        { qs: { } }, 
        handleResponse(resolve, reject)
      );
    });
  }
  
  function addAsset(name, domain, assetType) {
    return new Promise((resolve, reject) => {
      const data = {
        name: name,
        typeId: assetType.id,
        domainId: domain.id
      };
      apiCall(
        "assets", 
        { method: "POST", body: data }, 
        handleResponse(resolve, reject)
      );
    });
  }
  
  function allAssetTypes() {
    return new Promise((resolve, reject) => {
      apiCall(
        "assetTypes", 
        {},
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function allDomains() {
    return new Promise((resolve, reject) => {
      apiCall(
        "domains", 
        {}, 
        handleResponse(res => resolve(res.results), reject)
      );
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
      apiCall(
        "attributes", 
        { method: "POST", body: data }, 
        handleResponse(resolve, reject));
    });
  }
  
  function findAsset(assetId) {
    return new Promise((resolve, reject) => {
      apiCall(
        `assets/${assetId}`, 
        { }, 
        handleResponse(resolve, reject, status => {
          if (status == 404) {
            resolve(null);
          } else {
            handleResponse(resolve, reject);
          }
        })
      );
    });
  }
  
  function matchingAssets(searchQuery) {
    return new Promise((resolve, reject) => {
      apiCall(
        "assets", 
        { qs: { name: searchQuery } }, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }

  function definitionAttributesFor(assetId) {
    return new Promise((resolve, reject) => {
      definitionAttributeType().then( definitionAttrType => {
        const typeIds = [definitionAttrType.id];
        apiCall(
          "attributes", 
          { qs: { typeIds: typeIds, assetId: assetId } }, 
          handleResponse(res => resolve(res.results), reject)
        );
      });
    });
  }

  function definitionAttributeType() {
    return new Promise((resolve, reject) => {
      apiCall(
        "attributeTypes", 
        { qs: { name: "Definition", nameMatchMode: 'EXACT' } }, 
        handleResponse(resolve, reject)
      );
    });
  }

};



})()
     