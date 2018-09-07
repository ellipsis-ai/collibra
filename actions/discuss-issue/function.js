function(issue, ellipsis) {
  const CollibraApi = require('collibra-api');
const formatAttribute = require('definition-helpers').textForAttribute;

CollibraApi(ellipsis).then(api => {
  api.definitionAttributesFor(issue.id).then(attrs => {
    const definitions = attrs.map(formatAttribute).filter(ea => ea.length > 0);
    const successResult = {
      name: issue.label,
      link: api.linkFor("asset", issue.id),
      definitions: definitions
    };
    ellipsis.success(successResult, {
      next: {
        actionName: "discuss-issue-start", 
        args: [ { name: "issueId", value: issue.id } ]
      }
    });
  });
});
}
