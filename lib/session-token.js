/*
@exportId gG8NTNh0QpKLFVbLtu-9Lw
*/
module.exports = (function() {
const request = require('request');
const EllipsisApi = require('ellipsis-api');

const apiBaseUrl = "https://training-demo-53.collibra.com/rest/2.0";

return (ellipsis, username, password) => {
  return new Promise((resolve, reject) => {
    getSavedLogin(ellipsis).then(savedLogin => {
      const login = savedLogin || fallbackLogin(ellipsis);
      getSavedToken(ellipsis, login).then(savedToken => {
        if (savedToken) {
          isTokenValid(savedToken).then(isValid => {
            if (isValid) {
              resolve(savedToken);
            } else {
              getNewToken(ellipsis, login).then(resolve);
            }                   
          });
        } else {
          getNewToken(ellipsis, login).then(resolve);
        }
      });
    })
  });
}

function fallbackLogin(ellipsis) {
  return {
    username: "pieterdeleenheer",
    password: "datacamp",
    ellipsisUserId: ellipsis.userInfo.ellipsisUserId
  };
}

function getSavedLogin(ellipsis) {
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
      return res.data.loginList[0];
    } else {
      ellipsis.error(`Error getting saved login: ${JSON.stringify(res.errors)}`)
    }
  });

}

function isTokenValid(token) {
  return new Promise((resolve, reject) => {
    request({ 
      url: apiBaseUrl + "/auth/sessions/current",
      json: true,
      headers: { "Cookie": `JSESSIONID=${token.token}` }
    }, (err, res, body) => {
      if (err) {
        reject(err);
      } else if (res.statusCode != 200) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  });         
}

function getNewToken(ellipsis, login) {
  return new Promise((resolve, reject) => {
    const data = {
      username: login.username,
      password: login.password
    }
    const url = apiBaseUrl + "/auth/sessions";
    const jar = request.jar();
    request.post({
      url: url,
      json: true,
      body: data,
      jar: jar
    }, (err, res, body) => {
      if (err || res.statusCode != 200) {
        const msg = err || res.statusCode;
        reject("Unable to login: " + msg);
      } else {
        const cookies = jar.getCookies(url);
        const token = cookies.find(ea => ea.key = "JSESSIONID").value;
        saveToken(token, login.username, ellipsis).then(resolve);
      }
    });
  });
}

function getSavedToken(ellipsis, login) {
  const storageApi = new EllipsisApi(ellipsis).storage;

  const query = `
  query GetSessionToken($filter: SessionTokenInput!) {

      sessionTokenList(filter: $filter) {
        id
        token
        username
      }

    }
  `;
    
  const vars = { filter: { username: login.username } };
  return storageApi.query({query: query, variables: vars }).then(res => {
    return res.data.sessionTokenList[0];
  });
}

function saveToken(token, username, ellipsis) {
  const storageApi = new EllipsisApi(ellipsis).storage;

  const mutation = `
    mutation UpdateSessionToken($sessionToken: SessionTokenInput!, $filter: SessionTokenInput!) {

      deleteWhereSessionToken(filter: $filter) {
        id
      }

      createSessionToken(sessionToken: $sessionToken) {
        id
        token
        username
      }

    }
  `;
    
  const vars = { sessionToken: { token: token, username: username }, filter: { username: username } };
  return storageApi.query({ query: mutation, variables: vars });
}
})()
     