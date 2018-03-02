function(username, password, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const storageApi = new EllipsisApi(ellipsis).storage;
const getSessionToken = require('session-token');

getSessionToken(ellipsis, username, password).
  then(saveLogin).
  then(ellipsis.success).
  catch(err => ellipsis.error(`Unable to login to \`${username}\` with that password`));

function saveLogin() {
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

}
