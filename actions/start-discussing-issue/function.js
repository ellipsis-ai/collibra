function(issueId, ellipsis) {
  const CollibraApi = require('collibra-api');
const formatAttribute = require('definition-helpers').textForAttribute;

CollibraApi(ellipsis).then(api => {
  const comment = `There is a discussion thread about this issue <a class="link" href="${ellipsis.userInfo.messageInfo.permalink}">in Slack</a>`;
  api.addComment(issueId, comment).then(res => {
    ellipsis.success({ 
      issueLink: api.linkFor("asset", issueId)
    });
  });
});
}
