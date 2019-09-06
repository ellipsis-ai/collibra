function(ellipsis) {
  const EllipsisApi = ellipsis.require('ellipsis-api@copilot');
const api = new EllipsisApi(ellipsis);
api.actions.disableListen({
  actionName: "passive-find-definition",
  copilot: true
}).then((result) => {
  if (result > 0) {
    ellipsis.success("OK, I'm no longer listening.");
  } else {
    ellipsis.success("I wasn't listening here anyway, so I won't change anything.")
  }
});
}
