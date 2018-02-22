/*
@exportId MpTRLqqUS4m4_tF2nkWACg
*/
module.exports = (function() {
const EllipsisApi = require('ellipsis-api');

return ellipsis => {
  return new Promise((resolve, reject) => {
    const storageApi = new EllipsisApi(ellipsis).storage;

    const query = `
    query GetLogin($filter: LoginInput!) {

        loginList(filter: $filter) {
          id
          username
          password
          ellipsisUserId
        }

      }
    `;

    const vars = { filter: { ellipsisUserId: ellipsis.userInfo.ellipsisUserId } };
    return storageApi.query({query: query, variables: vars }).then(res => {
      if (res.data) {
        resolve(res.data.loginList[0] || fallbackLogin(ellipsis));
      } else {
        ellipsis.error(`Error getting saved login: ${JSON.stringify(res.errors)}`)
      }
    });
  });
};

function fallbackLogin(ellipsis) {
  return {
    username: "pieterdeleenheer",
    password: "datacamp",
    ellipsisUserId: ellipsis.userInfo.ellipsisUserId
  };
}
})()
     