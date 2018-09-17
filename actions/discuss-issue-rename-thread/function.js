function(commentId, permalink, name, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  api.findComment(commentId).then(oldComment => {
    const newLink = `<a class="link" href="${permalink}">${name}</a>`;
    const regex = /(<a.*?>.*?<\/a>)/i;
    const newComment = oldComment.content.replace(regex, newLink);
    api.updateComment(commentId, newComment).then(res => {
      ellipsis.success();
    });
  });
});
}
