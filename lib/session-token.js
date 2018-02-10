/*
@exportId gG8NTNh0QpKLFVbLtu-9Lw
*/
module.exports = (function() {
const request = require('request');
const EllipsisApi = require('ellipsis-api');

const apiBaseUrl = "https://training-demo-53.collibra.com/rest/2.0";
const username = "pieterdeleenheer";
const password = "datacamp";

return ellipsis => {
  return getSavedToken(ellipsis).then(savedToken => {
    if (savedToken) {
      isTokenValid(savedToken).then(isValid => {
        if (isValid) {
          return savedToken;
        } else {
          return getNewToken();
        }                   
      });
    } else {
      return getNewToken();
    }
  });
}

function isTokenValid(token) {
  return new Promise((resolve, reject) => {
    request({ 
      url: apiBaseUrl + "/auth/sessions/current",
      json: true,
      headers: { "Cookie": `JSESSIONID=${token}` }
    }, (err, res, body) => {
      if (err || res.statusCode != 200) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  });         
}

function getNewToken() {
  return new Promise((resolve, reject) => {
    const data = {
      username: username,
      password: password
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
        reject(err || res.statusCode);
      } else {
        const cookies = jar.getCookies(url);
        const token = cookies.find(ea => ea.key = "JSESSIONID").value;
        resolve(token);
      }
    })
  });
}

function getSavedToken(ellipsis) {
  const storageApi = new EllipsisApi(ellipsis).storage;

  const query = `
  {
    sessionTokenList(filter: { }) {
      id
      token
    }
  }
  `;
    
  return storageApi.query({query: query}).then(res => {
    res.data.sessionTokenList[0];
  });
}
})()
     