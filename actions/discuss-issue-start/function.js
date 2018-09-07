function(issueId, ellipsis) {
  const CollibraApi = require('collibra-api');
const formatAttribute = require('definition-helpers').textForAttribute;

const username = ellipsis.userInfo.messageInfo.details.name;
const permalink = ellipsis.userInfo.messageInfo.permalink;
CollibraApi(ellipsis).then(api => {
  const commentText = `${username}'s discussion in Slack`;
  const comment = `<a class="link" href="${permalink}">${commentText}</a>`;
  api.addComment(issueId, comment).then(saved => {
    ellipsis.success({ 
      issueLink: api.linkFor("asset", issueId),
      commentText: commentText
    }, {
      choices: [
        { 
          label: "Rename thread",
          actionName: "discuss-issue-rename-thread",
          allowMultipleSelections: true,
          allowOthers: true,
          args: [
            { name: "permalink", value: permalink },
            { name: "commentId", value: saved.id }
          ]
        }
      ]
    });
  });
});
}
