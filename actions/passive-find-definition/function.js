function(ellipsis) {
  const CollibraApi = require('collibra-api');
const formatAttribute = require('definition-helpers').textForAttribute;
const sw = require('stopword');
const FuzzyMatching = require('fuzzy-matching');
const define = require('word-definition');

const message = ellipsis.event.message ? ellipsis.event.message.text : '';
const words = matchWordsFor(message);
const fm = new FuzzyMatching(words);

const MATCH_THRESHOLD = 0.7;

function matchWordsFor(text) {
  let words = 
    text.split(" ").
    map(ea => ea.replace(/[^a-zA-Z0-9]/gi, "")).
    filter(ea => ea.length);
  return sw.removeStopwords(words);
}

collibraMatches().then(matches => {
  if (matches.length) {
    ellipsis.success({
      message: message,
      assets: matches
    })
  } else {
    ellipsis.noResponse();
  }
})

function collibraMatches() {
  return CollibraApi(ellipsis).then(api => {
    return Promise.all(words.map(ea => matchesFor(ea, api))).then(results => {
      return results.reduce((acc, val) => acc.concat(val), []);
    });
  });
}

function matchesFor(word, api) {
  return api.matchingAssets(word, { }).then(res => {
    const assetsToUse = res.filter(ea => {
      const assetWords = matchWordsFor(ea.displayName);
      return assetWords.some(ea => fm.get(ea).distance > MATCH_THRESHOLD);
    });
    return Promise.all(assetsToUse.map(ea => withDefinitionsFor(ea, api))).then(collibraMatches => {
      return Promise.all(collibraMatches.map(match => {
        const toLookUp = matchWordsFor(match.name);
        return Promise.all(toLookUp.map(word => {
          return withDictionaryDefinitionsFor(word);
        })).then(possibleDictionaryMatches => {
          const dictionaryMatches = possibleDictionaryMatches.filter(ea => ea != null);
          return Object.assign({}, match, { dictionary: dictionaryMatches, hasDictionaryMatches: !!dictionaryMatches.length });
        });
      }));
    });
  });
}

function withDefinitionsFor(asset, api) {
  return api.definitionAttributesFor(asset.id).then(attrs => {
    return {
      name: asset.displayName,
      definitions: attrs.map(formatAttribute).filter(ea => ea.length > 0)
    };
  });
}

function dictionaryDefinitions() {
  return Promise.all(words.map(ea => withDictionaryDefinitionsFor(ea)));
}

function withDictionaryDefinitionsFor(word) {
  // word-definition pulls a definition from wiktionary.org
  return new Promise((resolve, reject) => {
    define.getDef(word, 'en', null, (result) => {
      if (result.err) {
        resolve(null);
      } else {
        resolve(result);
      }
    });
  })
  
}
}
