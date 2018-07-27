/*
@exportId gG8NTNh0QpKLFVbLtu-9Lw
*/
module.exports = (function() {
const request = require('request');
const getLoginForCurrentUser = require('saved-login').getLoginForCurrentUser;
const EllipsisApi = require('ellipsis-api');
const shouldLogTiming = require('should-log-timing');

return {
  getSessionToken: getSessionToken,
  deleteSessionTokenFor: deleteTokenFor
}

function apiBaseUrl(ellipsis) {
  return `https://${ellipsis.env.COLLIBRA_SUBDOMAIN}.collibra.com/rest/2.0`;
}

function getSessionToken(ellipsis, username, password) {
  const eventualLogin = 
    (username && password) ? 
       Promise.resolve({ username: username, password: password, ellipsisUserId: ellipsis.userInfo.ellipsisUserId }) :
       getLoginForCurrentUser(ellipsis);
  
  return new Promise((resolve, reject) => {
    eventualLogin.then(login => {
      getNewToken(ellipsis, login).then(resolve);
//       getSavedToken(ellipsis, login).then(savedToken => {
//         isTokenValid(savedToken, username, ellipsis).then(isValid => {
//           if (isValid) {
//             resolve(savedToken);
//           } else {
//             getNewToken(ellipsis, login).then(resolve);
//           }                   
//         });
//       });
    })
  });
}

// not more than 10s old
function isRecent(token) {
  if (token.timestamp) {
    const now = new Date();
    const tokenTimestamp = new Date(token.timestamp);
    return tokenTimestamp > new Date(now - 10000);
  } else {
    return false;
  }
}
  
function isTokenValid(token, username, ellipsis) {
  const shouldLog = shouldLogTiming(ellipsis);
  return new Promise((resolve, reject) => {
    if (!token) { 
      resolve(false); 
    } else if (isRecent(token)) {
      resolve(true);
    } else {
      request({ 
        url: apiBaseUrl(ellipsis) + "/auth/sessions/current",
        json: true,
        time: shouldLog,
        headers: { "Cookie": `JSESSIONID=${token.token}` }
      }, (err, res, body) => {
        if (shouldLog) {
          console.log(`\nAPI call ${res.request.uri.href}\nElapsed time: ${res.elapsedTime}\n`);
        }
        if (err) {
          reject(new ellipsis.Error(err.message, { userMessage: res.statusCode === 401 ?
                                         "An error occurred. Your login credentials do not appear to be valid." :
                                         "An unknown error occurred. Collibra may not be working at the moment."
                                        }));
        } else if (res.statusCode != 200) {
          resolve(false);
        } else {
          saveToken(token.token, username, ellipsis).then(res => resolve(true));
        }
      })
    }
  });         
}

function getNewToken(ellipsis, login) {
  const shouldLog = shouldLogTiming(ellipsis);
  return new Promise((resolve, reject) => {
    const data = {
      username: login.username,
      password: login.password
    }
    const url = apiBaseUrl(ellipsis) + "/auth/sessions";
    const jar = request.jar();
    request.post({
      url: url,
      json: true,
      time: shouldLog,
      body: data,
      jar: jar
    }, (err, res, body) => {
      if (shouldLog) {
        console.log(`\nAPI call ${res.request.uri.href}\nElapsed time: ${res.elapsedTime}\n`);
      }
      if (err || res.statusCode != 200) {
        const message = err && err.message || `Error ${res.statusCode}: ${res.statusMessage}`;
        reject(new ellipsis.Error(message, { userMessage: res.statusCode === 401 ?
                                       "An error occurred. Your login credentials do not appear to be valid." :
                                       "An unknown error occurred. Collibra may not be working at the moment."
                                      }));
      } else {
        const cookies = jar.getCookies(url);
        const token = cookies.find(ea => ea.key = "JSESSIONID").value;
        const timestamp = (new Date()).toString();
        const tokenObj = { token: token, username: login.username, timestamp: timestamp };
        resolve(tokenObj);
//         saveToken(token, login.username, ellipsis).then(resolve);
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
        timestamp
      }

    }
  `;

  const vars = { filter: { username: login.username } };
  return storageApi.query({query: query, variables: vars }).then(res => {
    return res.data.sessionTokenList[0];
  });
}

function deleteTokenFor(username, ellipsis) {
  const storageApi = new EllipsisApi(ellipsis).storage;

  const mutation = `
    mutation DeleteSessionToken($filter: SessionTokenInput!) {

      deleteWhereSessionToken(filter: $filter) {
        id
      }

    }
  `;

  const vars = { filter: { username: username } };
  return storageApi.query({ query: mutation, variables: vars }).then(res => {
    if (res.data) {
      return res.data.deleteWhereSessionToken;
    } else {
      return null;
    }
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
        timestamp
      }

    }
  `;

  const timestamp = (new Date()).toString();
  const vars = { sessionToken: { token: token, username: username, timestamp: timestamp }, filter: { username: username } };
  return storageApi.query({ query: mutation, variables: vars }).then(res => {
    if (res.data) {
      return res.data.createSessionToken;
    } else {
      return null;
    }
  });
}
})()
     