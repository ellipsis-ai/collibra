/*
@exportId DxJgJij4RGiOMJ2dw4ktew
*/
module.exports = (function() {
const CollibraApi = require('collibra-api');

return {
  assetsMatching: assetsMatching
};

function assetsMatching(searchQuery, ellipsis) {
  return new Promise((resolve, reject) => {
    const api = CollibraApi(ellipsis);
    api.findAsset(searchQuery).then(asset => {
      const idMatches = asset ? [asset] : [];
      api.matchingAssets(searchQuery).then(matches => {
        resolve(matches.concat(idMatches).map(ea => {
          return {
            id: ea.id,
            label: `${ea.name}`
          };
        }));
      });
    })
  });

}

})()
     