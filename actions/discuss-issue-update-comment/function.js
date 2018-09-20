function(commentId, ellipsis) {
  const CollibraApi = require('collibra-api');
const moment = require('moment-timezone');

CollibraApi(ellipsis).then(api => {
  const fixedCommentId = commentId.replace(/^\"/, "").replace(/\"$/, "");
  api.findComment(fixedCommentId).then(oldComment => {
    const ts = moment().tz(ellipsis.teamInfo.timeZone).format("h:mm:ss a on MMMM Do YYYY");
    const user = ellipsis.userInfo.messageInfo.details.name;
    const newLastUpdated = `Last message was from ${user} at ${ts}`;
    const regex = /Last message was (from .+ )?at .+$/i;
    const oldContent = oldComment.content;
    const newComment = regex.test(oldContent) ? oldContent.replace(regex, newLastUpdated) : oldContent + "<br>" + newLastUpdated;
    api.updateComment(fixedCommentId, newComment).then(res => {
      ellipsis.noResponse();
    });
  });
});
}
