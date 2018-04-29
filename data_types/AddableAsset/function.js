function(searchQuery, ellipsis) {
  const assetsMatching = require('asset-helpers').assetsMatching;
assetsMatching(searchQuery, ellipsis).then( matches => {
  ellipsis.success(matches.concat(extraOptionsFor(matches)));
});

function extraOptionsFor(matches) {
  const exactMatch = matches.find(ea => ea.label.toLowerCase().trim() === searchQuery.toLowerCase().trim());
  if (exactMatch) {
    return [];
  } else {
    return [
      {
        id: "ellipsis-add-new",
        label: matches.length > 0 ?
          `Add a new asset named “${searchQuery}”…` :
          `No matches found — add a new one named “${searchQuery}”…`,
        searchQuery: searchQuery
      }
    ];
  }
}
}
