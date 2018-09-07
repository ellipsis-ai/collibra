function(commentId, permalink, name, ellipsis) {
  const CollibraApi = require('collibra-api');

CollibraApi(ellipsis).then(api => {
  const comment = `<a class="link" href="${permalink}">${name}</a>`;
  api.updateComment(commentId, comment).then(res => {
    ellipsis.success();
  });
});
}
