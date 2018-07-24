/*
@exportId yt-z_2HAQgaw0xKqWsKlsQ
*/
module.exports = (function() {
const request = require('request');
const getSessionToken = require('session-token').getSessionToken;
const shouldLogTiming = require('should-log-timing');

return ellipsis => {
  
  const baseUrl = `https://${ellipsis.env.COLLIBRA_SUBDOMAIN}.collibra.com`;
  const apiBaseUrlV1 = `${baseUrl}/rest/1.0`
  const apiBaseUrlV2 = `${baseUrl}/rest/2.0`;
  const shouldLog = shouldLogTiming(ellipsis);
  
  return new Promise((resolve, reject) => {
    getSessionToken(ellipsis).then(token => {
      resolve({
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
        findAssetTypeNamed: findAssetTypeNamed,
        findAssetTypeIdNamed: findAssetTypeIdNamed,
        assetsInDomain: assetsInDomain,
        listCommunities: listCommunities,
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
        relationTypesWithRole: relationTypesWithRole,
        findBusinessStewardRole: findBusinessStewardRole,
        findBusinessStewardForCommunity: findBusinessStewardForCommunity,
        isCannedUser: isCannedUser
      });
  
      function apiCall(endpoint, options, resultFn, apiBaseUrlOverride) {
        const apiBaseUrl = apiBaseUrlOverride || apiBaseUrlV2;
        const url = apiBaseUrl + "/" + endpoint;
        const defaultArgs = {
          url: url,
          json: true,
          time: shouldLogTiming,
          headers: { "Cookie": `JSESSIONID=${token.token}` }
        };
        const args = Object.assign({}, defaultArgs, options);
        request(args, resultFn);
      }

      function handleResponse(resolve, reject, statusHandler) {
        return (err, res, body) => {
          if (err) {
            reject(err);
          } else {
            const status = res.statusCode;
            if (shouldLog) {
              console.log(`\nAPI call ${res.request.uri.href}\nElapsed time: ${res.elapsedTime}\n`);
            }
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
        }).then(res => res.filter(ea => !!ea.businessItem));
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
        return definitionAttributeTypeId().then(typeId => {
          addAttribute(assetId, typeId, definition);
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

      function isCannedUser(username) {
        return username == ellipsis.env.COLLIBRA_CITIZEN_USERNAME || username == ellipsis.env.COLLIBRA_STEWARD_USERNAME;
      }

      function domainIdToRestrictToParams() {
        return new Promise((resolve, reject) => {
          getSessionToken(ellipsis).then(token => {
            const domainId = ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID;
            if (isCannedUser(token.username) && domainId) {
              resolve({ domainId: domainId });
            } else {
              resolve({});
            }
          });
        });
      }

      function findAsset(assetId) {
        return new Promise((resolve, reject) => {
          domainIdToRestrictToParams().then(params => {
            apiCall(
              `assets/${assetId}`, 
              params, 
              handleResponse(resolve, reject, status => {
                if (status == 404) {
                  resolve(null);
                } else {
                  handleResponse(resolve, reject);
                }
              })
            );
          });
        });
      }

      function rolesNamed(name) {
        return new Promise((resolve, reject) => {
          apiCall(
            `roles`, 
            { qs: { name: name } }, 
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

      function findBusinessStewardRole() {
        return rolesNamed("Business Steward").then(res => res.results[0]);
      }

      function findBusinessStewardRoleId() {
        const cached = ellipsis.env.COLLIBRA_BUSINESS_STEWARD_ROLE_ID;
        if (cached) {
          return Promise.resolve(cached);
        } else {
          return findBusinessStewardRole().then(role => role.id);
        }
      }

      function findResponsibilitiesMatching(roleId, resourceId) {
        return new Promise((resolve, reject) => {
          apiCall(
            `responsibilities`, 
            { qs: { resourceIds: resourceId, roleIds: roleId } }, 
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

      function findUser(userId) {
        return new Promise((resolve, reject) => {
          apiCall(
            `users/${userId}`, 
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

      function findBusinessStewardForCommunity(communityId) {
        return new Promise((resolve, reject) => {
          findBusinessStewardRoleId().then(roleId => {
            findResponsibilitiesMatching(roleId, communityId).then(res => {
              const responsibility = res.results[0];
              if (responsibility) {
                findUser(responsibility.owner.id).then(user => {
                  if (user) {
                    resolve(user);
                  } else {
                    resolve(null);
                  }
                })
              } else {
                resolve(null);
              }
            });
          });
        });
      }

      function findAssetTypeNamed(name) {
        if (name === undefined) {
          return Promise.resolve(undefined);
        } else {
          return new Promise((resolve, reject) => {
            allAssetTypes().then(types => {
              resolve(types.find(ea => ea.name === name));
            })
          });
        }
      }

      function findAssetTypeIdNamed(name) {
        return new Promise((resolve, reject) => {
          findAssetTypeNamed(name).then(match => {
            resolve(match ? match.id : undefined);
          })
        });
      }

      function matchingAssets(searchQuery, optionalAssetTypeId) {
        return new Promise((resolve, reject) => {
          domainIdToRestrictToParams().then(params => {
            const paramsToUse = optionalAssetTypeId ? Object.assign({}, params, { typeId: optionalAssetTypeId }) : params;
            apiCall(
              "assets", 
              { qs: Object.assign({ name: searchQuery }, paramsToUse) }, 
              handleResponse(res => resolve(res.results), reject)
            );
          });
        });
      }

      function assetsInDomain(domainId, limit) {
        return new Promise((resolve, reject) => {
          apiCall(
            "assets", 
            { qs: { domainId: domainId, limit: limit } }, 
            handleResponse(res => resolve(res.results), reject)
          );
        });
      }

      function listCommunities() {
        return new Promise((resolve, reject) => {
          apiCall(
            "communities", 
            {}, 
            handleResponse(res => resolve(res.results), reject)
          );
        });
      }

      function definitionAttributesFor(assetId) {
        return new Promise((resolve, reject) => {
          definitionAttributeTypeId().then( typeId => {
            const typeIds = [typeId];
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

      function definitionAttributeTypeId() {
        const cached = ellipsis.env.COLLIBRA_DEFINITION_ATTRIBUTE_TYPE_ID;
        if (cached) {
          return Promise.resolve(cached);
        } else {
          return definitionAttributeType().then(t => t.id);
        }
      }

    });
  
  });
};
})()
     