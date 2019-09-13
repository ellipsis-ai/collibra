/*
@exportId MpTRLqqUS4m4_tF2nkWACg
*/
module.exports = (function() {
const EllipsisApi = require('ellipsis-api');

return {
  getLoginForCurrentUser: getLoginForCurrentUser,
  getLoginForUsername: getLoginForUsername,
  saveLogin: saveLogin,
  deleteSavedLoginForCurrentUser: deleteSavedLoginForCurrentUser
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
        const saved = res.data.loginList[0];
        const login = saved || defaultLoginFor(ellipsis, filter.username);
        if (login) {
          resolve(login);
        } else {
          reject(new ellipsis.Error("User is not logged in", { userMessage: "You need to log in to Collibra first by typing `…log in to collibra`" }));
        }
      } else {
        reject(new ellipsis.Error(`Error getting saved login: ${JSON.stringify(res.errors)}`, { userMessage: "An unexpected error occurred while trying to find your login credentials." }))
      }
    });
  });
}

function defaultLoginFor(ellipsis, optionalUsername) {
  const username = optionalUsername || ellipsis.env.COLLIBRA_CITIZEN_USERNAME;
  const password = 
    (optionalUsername && optionalUsername === ellipsis.env.COLLIBRA_STEWARD_USERNAME) ? 
      ellipsis.env.COLLIBRA_STEWARD_PASSWORD :
      ellipsis.env.COLLIBRA_PASSWORD;
  if (username && password) {
    return {
      username: username,
      password: password,
      ellipsisUserId: ellipsis.userInfo.ellipsisUserId
    };
  } else {
    return null;
  }
}

function deleteSavedLoginForCurrentUser(ellipsis) {
  const storageApi = new EllipsisApi(ellipsis).storage;
  
  const mutation = `
    mutation DeleteLogin($filter: LoginInput!) {

      deleteWhereLogin(filter: $filter) {
        id
        username
      }

    }
  `;
    
  const vars = { filter: { ellipsisUserId: ellipsis.userInfo.ellipsisUserId } };
  return storageApi.query({ query: mutation, variables: vars });
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
     