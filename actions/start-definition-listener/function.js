function(ellipsis) {
  const EllipsisApi = ellipsis.require('ellipsis-api@copilot');
const api = new EllipsisApi(ellipsis);
api.actions.listen({
  actionName: "passive-find-definition",
  copilot: true
}).then(res => {
  ellipsis.success(`OK, I'm listening. You can follow along at: ${ellipsis.apiBaseUrl}/copilot/${res}`);
});
}
