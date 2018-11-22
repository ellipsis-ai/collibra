function(issueId, ellipsis) {
  const CollibraApi = require('collibra-api');
const formatAttribute = require('definition-helpers').textForAttribute;
const EllipsisApi = require('ellipsis-api');
const api = new EllipsisApi(ellipsis);

const username = ellipsis.userInfo.fullName || `@${ellipsis.userInfo.userName}` || "Anonymous user";
const permalink = ellipsis.userInfo.messageInfo.permalink;
if (!permalink) {
  ellipsis.error("No valid permalink", {
    userMessage: "I couldn’t update Collibra because there was no valid message link to use."
  });
  return;
}

CollibraApi(ellipsis).then(collibra => {
  const commentText = `${username}’s discussion in ${ellipsis.userInfo.messageInfo.mediumDescription}`;
  const comment = `<a class="link" href="${permalink}">${commentText}</a>`;
  collibra.addComment(issueId, comment).then(saved => {
    api.listen({
      actionName: 'discuss-issue-update-comment',
      args: [
        { name: "commentId", value: saved.id }
      ],
      thread: ellipsis.userInfo.messageInfo.thread
    }).then(() => {
      ellipsis.success({ 
        issueLink: collibra.linkFor("asset", issueId),
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
});
}
