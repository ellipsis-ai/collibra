function(assetName, ellipsis) {
  const CollibraApi = require('collibra-api');
const apiCall = CollibraApi(ellipsis);

matchingAssets().then(assets => {
  Promise.all(assets.map(asset => {
    return definitionAttributesFor(asset.id).then(attrs => {
      const definition = attrs.map(ea => ea.value).join(", ").trim();
      const hasDefinition = definition.length > 0;
      const link = `https://training-demo-53.collibra.com/asset/${asset.id}`;
      return {
        asset: asset,
        link: link,
        hasDefinition: hasDefinition,
        definition: definition
      };
    });          
  })).then(assetsWithDefinitions => {
    const result = {
      count: assetsWithDefinitions.length,
      results: assetsWithDefinitions
    };
    ellipsis.success(result);
  });
});

function matchingAssets() {
  return new Promise((resolve, reject) => {
    apiCall("assets", { qs: { name: assetName } }, (err, res, body) => {
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
    definitionAttributeTypes().then( attrTypes => {
      const typeIds = attrTypes.map(ea => ea.id);
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

function definitionAttributeTypes() {
  return new Promise((resolve, reject) => {
    apiCall("attributeTypes", { qs: { name: "definition" } }, (err, res, body) => {
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
}
