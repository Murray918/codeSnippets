const credentials = [{
  username: 'Andrew Murray',
  password: '12345678'
}, {
  username: 'Admin',
  password: '0987765'
}]

function loginProofer(user, pass) {
  let login = false;
    credentials.forEach( check => {
      if (check.username === user && check.password === pass) {
        login = true;
      }
    });
  return login;
}


module.exports = {
credentials : credentials,
loginProofer : loginProofer
}
