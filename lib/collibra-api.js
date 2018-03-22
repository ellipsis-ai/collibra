/*
@exportId yt-z_2HAQgaw0xKqWsKlsQ
*/
module.exports = (function() {
const request = require('request');
const getSessionToken = require('session-token');

return ellipsis => {
  
  const baseUrl = `https://${ellipsis.env.COLLIBRA_SUBDOMAIN}.collibra.com`;
  const apiBaseUrlV1 = `${baseUrl}/rest/1.0`
  const apiBaseUrlV2 = `${baseUrl}/rest/2.0`;
  
  return {
    apiCall: apiCall,
    allCommentsFor: allCommentsFor,
    addAsset: addAsset,
    addResponsibility: addResponsibility,
    allAssetTypes: allAssetTypes,
    allDomains: allDomains,
    allRoles: allRoles,
    matchingUsers: matchingUsers,
    linkFor: linkFor,
    findAsset: findAsset,
    matchingAssets: matchingAssets,
    definitionAttributesFor: definitionAttributesFor,
    addDefinition: addDefinition,
    updateDefinition: updateDefinition,
    listWorkflowDefinitions: listWorkflowDefinitions,
    startWorkflow: startWorkflow,
    startAssetApprovalWorkflowFor: startAssetApprovalWorkflowFor,
    startSimpleApprovalWorkflowFor: startSimpleApprovalWorkflowFor,
    listWorkflowTasks: listWorkflowTasks,
    nextTaskForAsset: nextTaskForAsset,
    formForWorkflowTask: formForWorkflowTask,
    completeTask: completeTask,
    allRelationsForAsset: allRelationsForAsset,
    findRelationType: findRelationType,
    allAssetRelationTypes: allAssetRelationTypes,
    addRelation: addRelation,
    relationTypesWithRole: relationTypesWithRole
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
        } if (status == 204) {
          resolve({});
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
  
  function allCommentsFor(assetId) {
    return new Promise((resolve, reject) => {
      apiCall(
        "comments", 
        { qs: { baseResourceId: assetId } }, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function formForWorkflowTask(taskId) {
    return new Promise((resolve, reject) => {
      const path = `workflow/task/${taskId}/form`;
      apiCall(path, { qs: { } }, handleResponse(resolve, reject), apiBaseUrlV1);
    });
  }
  
  function allRelationsForAsset(assetId, relationTypeId) {
    return new Promise((resolve, reject) => {
      apiCall(
        "relations", 
        { qs: { 
          sourceId: assetId, 
          targetId: assetId, 
          sourceTargetLogicalOperator: "OR", 
          relationTypeId: relationTypeId 
        } }, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function allAssetRelationTypes() {
    return new Promise((resolve, reject) => {
      apiCall(
        "relationTypes", 
        { qs: { sourceTypeName: "Asset", targetTypeName: "Asset" } }, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function relationTypesWithRole(role) {
    return new Promise((resolve, reject) => {
      apiCall(
        "relationTypes", 
        { qs: { role: role, sourceTypeName: "Asset", targetTypeName: "Asset" } }, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function findRelationType(typeId) {
    return new Promise((resolve, reject) => {
      apiCall(
        `relationTypes/${typeId}`, 
        {}, 
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
  
  function addRelation(sourceAssetId, targetAssetId, relationTypeId) {
    return new Promise((resolve, reject) => {
      const data = {
        sourceId: sourceAssetId,
        targetId: targetAssetId,
        typeId: relationTypeId
      };
      apiCall(
        "relations", 
        { method: "POST", body: data }, 
        handleResponse(resolve, reject)
      );
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
  
  function nextTaskForAsset(assetId) {
    return listWorkflowTasks().then(tasks => {
      return tasks.find(ea => ea.businessItem.id == assetId);
    });
  }
  
  function listWorkflowDefinitions() {
    return new Promise((resolve, reject) => {
      apiCall(
        "workflowDefinitions", 
        {}, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function matchingWorkflowDefinitions(name) {
    return new Promise((resolve, reject) => {
      apiCall(
        "workflowDefinitions", 
        { qs: { name: name } }, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function startWorkflow(assetId, definitionId) {
    return new Promise((resolve, reject) => {
      const data = {
        workflowDefinitionId: definitionId,
        businessItemIds: [assetId],
        businessItemType: "ASSET"
      };
      const success = res => resolve({ success: res });
      apiCall(
        "workflowInstances", 
        { method: "POST", body: data }, 
        handleResponse(
          success, 
          reject, 
          (status, res, body) => {
            if (status == 400) {
              resolve({ 
                error: `${body.titleMessage}: ${body.userMessage || ""}\n\n${body.helpMessage || ""}`,
                status: status,
                res: res,
                body: body
              });
            } else {
              resolve({ error: `${status}: ${JSON.stringify(body)}` });
            }
          }
        )
      );
    });
  }
  
  function startAssetApprovalWorkflowFor(assetId) {
    return matchingWorkflowDefinitions("Asset Approval process").then(matches => {
      return startWorkflow(assetId, matches[0].id);
    });
  }
  
  function startSimpleApprovalWorkflowFor(assetId) {
    return matchingWorkflowDefinitions("Simple Approval Process").then(matches => {
      return startWorkflow(assetId, matches[0].id);
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
        `workflow/task/${taskId}/complete`, 
        { method: "POST", form: formProperties }, 
        handleResponse(
          success, 
          reject, 
          (status, res, body) => {
            if (status == 400) {
              resolve({ 
                error: `${res.body.title}: ${res.body.message}\n\n${res.body.help}`,
                status: status,
                res: res,
                body: body
              });
            } else {
              resolve({ error: `${status}: ${JSON.stringify(body)}` });
            }
          }
        ),
        apiBaseUrlV1
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
  
  function addResponsibility(asset, role, user) {
    return new Promise((resolve, reject) => {
      const data = {
        roleId: role.id,
        ownerId: user.id,
        resourceId: asset.id,
        resourceType: "Asset"
      };
      apiCall(
        "responsibilities", 
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
  
  function allRoles() {
    return new Promise((resolve, reject) => {
      apiCall(
        "roles", 
        {}, 
        handleResponse(res => resolve(res.results), reject)
      );
    });
  }
  
  function matchingUsers(searchQuery) {
    return new Promise((resolve, reject) => {
      apiCall(
        "users", 
        { qs: { name: searchQuery } }, 
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
  
  function updateDefinition(assetId, definition) {
    return definitionAttributesFor(assetId).then(existing => {
      Promise.all(existing.map(ea => removeAttribute(ea.id))).then(res => {
        return addDefinition(assetId, definition);
      });
    });
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
    
  function removeAttribute(attributeId) {
    return new Promise((resolve, reject) => {
      apiCall(
        `attribute/${attributeId}`, 
        { method: "DELETE" }, 
        handleResponse(resolve, reject, status => {
          if (status == 404) {
            resolve(null);
          } else {
            handleResponse(resolve, reject);
          }
        }),
        apiBaseUrlV1
      );
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
        "attributeTypes/name/Definition", 
        {}, 
        handleResponse(resolve, reject)
      );
    });
  }

};

})()
     