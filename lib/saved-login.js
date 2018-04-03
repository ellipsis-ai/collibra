/*
@exportId MpTRLqqUS4m4_tF2nkWACg
*/
module.exports = (function() {
const EllipsisApi = require('ellipsis-api');

return {
  getLoginForCurrentUser: getLoginForCurrentUser,
  getLoginForUsername: getLoginForUsername,
  saveLogin: saveLogin
};

function getLoginForCurrentUser(ellipsis) {
  const uid = ellipsis.userInfo ? ellipsis.userInfo.ellipsisUserId : null;
  return getLoginFor(ellipsis, { ellipsisUserId: uid });
}

function getLoginForUsername(ellipsis, username) {
  return getLoginFor(ellipsis, { username: username });
}

function getLoginFor(ellipsis, filter) {
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

    const vars = { filter: filter };
    return storageApi.query({query: query, variables: vars }).then(res => {
      if (res.data) {
        const found = res.data.loginList[0];
        if (found) {
          resolve(found);
        } else {
          reject("Couldn't find a saved login for this user");
        }
      } else {
        reject(`Error getting saved login: ${JSON.stringify(res.errors)}`)
      }
    });
  });
}

function saveLogin(ellipsis, username, password) {
  const storageApi = new EllipsisApi(ellipsis).storage;
  
  const mutation = `
    mutation SaveLogin($login: LoginInput!, $filter: LoginInput!) {

      deleteWhereLogin(filter: $filter) {
        id
      }

      createLogin(login: $login) {
        id
        username
        password
        ellipsisUserId
      }

    }
  `;
    
  const ellipsisUserId = ellipsis.userInfo.ellipsisUserId;
  const loginData = { 
    username: username,
    password: password,
    ellipsisUserId: ellipsisUserId
  }
  const vars = { login: loginData, filter: { ellipsisUserId: ellipsisUserId } };
  return storageApi.query({ query: mutation, variables: vars });
}
})()
     