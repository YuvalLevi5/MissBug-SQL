export const userService = {
  login,
  logout,
  getLoggedInUser,
  signup,
  query,
  removeUser,
}

const STORAGE_KEY = 'user'

function query() {
  return axios.get('/api/user').then((res) => res.data)
}

function removeUser(userId) {
  return axios.delete('/api/user/' + userId).then((res) => res.data)
}

function login(credential) {
  return axios
    .post('/api/login', credential)
    .then((res) => res.data)
    .then((user) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      console.log('user logged in successfully')
      return user
    })
}

function logout() {
  return axios
    .post('/api/logout')
    .then(() => {
      sessionStorage.removeItem(STORAGE_KEY)
      console.log('user logged out successfully')
    })
    .catch((err) => console.error(err))
}

function signup(signupInfo) {
  return axios
    .post('/api/signup', signupInfo)
    .then((res) => res.data)
    .then((user) => {
      console.log(user);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    })
}

function getLoggedInUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY))
}
