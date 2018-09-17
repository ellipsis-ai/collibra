function(commentId, message, ellipsis) {
  const CollibraApi = require('collibra-api');
const moment = require('moment-timezone');

CollibraApi(ellipsis).then(api => {
  const fixedCommentId = commentId.replace(/^\"/, "").replace(/\"$/, "");
  api.findComment(fixedCommentId).then(oldComment => {
    const ts = moment().tz(ellipsis.teamInfo.timeZone).format("h:mm:ss a on MMMM Do YYYY");
    const newLastUpdated = `Last message was at ${ts}`;
    const regex = /Last message was at .+$/i;
    const oldContent = oldComment.content;
    const newComment = regex.test(oldContent) ? oldContent.replace(regex, newLastUpdated) : oldContent + "<br>" + newLastUpdated;
    api.updateComment(fixedCommentId, newComment).then(res => {
      ellipsis.noResponse();
    });
  });
});
}
