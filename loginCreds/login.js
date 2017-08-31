const credentials = [{
  username: 'Andrew Murray',
  password: '12345678'
}, {
  username: 'Admin',
  password: '0987765'
}]

function loginCreator (user, pass) {
  let login = false;
  let newLogin = {}
  newLogin.username = user;
  newLogin.password = pass;
  credentials.forEach(checker => {
    if (newLogin.username === checker.username){
      let error = `The name ${newlogin.username} has been taken by another user.`
    } else {
      credentials.push(newLogin);
      login = true;
    }
  })

}

function loginProofer(user, pass) {
  let login = false;
    credentials.forEach( checker => {
      if (checker.username === user && checker.password === pass) {
        login = true;
      }
    });
  return login;
}


module.exports = {
credentials : credentials,
loginProofer : loginProofer,
loginCreator : loginCreator
}
