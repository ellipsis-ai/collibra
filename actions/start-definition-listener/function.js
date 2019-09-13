function(ellipsis) {
  const EllipsisApi = ellipsis.require('ellipsis-api@copilot');
const api = new EllipsisApi(ellipsis);
api.actions.listen({
  actionName: "passive-find-definition",
  copilot: true
}).then(res => {
  ellipsis.success(`OK, I'm listening. [Follow along here](${ellipsis.apiBaseUrl}/copilot/${res})`);
});
}
