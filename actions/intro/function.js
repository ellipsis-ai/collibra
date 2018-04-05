function(ellipsis) {
  const getLoginForCurrentUser = require('saved-login').getLoginForCurrentUser;
const CollibraApi = require('collibra-api');
const collibra = CollibraApi(ellipsis);

getLoginForCurrentUser(ellipsis).then(login => {
  const collibraUsername = login ? login.username : "<not logged in>";
  const isCannedUser = collibra.isCannedUser(collibraUsername);
  const defaultDomain = ellipsis.env.COLLIBRA_RESTRICT_TO_DOMAIN_ID;
  ellipsis.success({
    slackUserName: ellipsis.userInfo.fullName,
    collibraUsername: collibraUsername,
    isCannedUser: isCannedUser
  }, {
    choices: [
      { 
        label: "Find an asset definition",
        actionName: "find-definition"
      },
      {
        label: "Add a new asset",
        actionName: "add-asset",
        args: [ 
          { name: "domain", value: defaultDomain }
        ]
      },
      { 
        label: "Other useful commands",
        actionName: "intro-useful-commands"
      }
    ]
  });
});
}
