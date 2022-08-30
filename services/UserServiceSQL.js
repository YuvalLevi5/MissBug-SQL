const DBService = require('./DBServiceSQL')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('puki-is-the-best-919121123')

function getUsers(criteria = {}) {
  var namePart = criteria.name || ''
  var query = `SELECT * FROM user  WHERE user.username LIKE '%${namePart}%' OR user.fullname LIKE '%${namePart}%'`

  return DBService.runSQL(query)
}

async function signup(user) {
  var sqlCmd = `INSERT INTO user (fullname, username, password, isAdmin) 
                VALUES ("${user.fullname}",
                        "${user.username}",
                        "${user.password}",
                        "${user.isAdmin}")`
  const newUser = await DBService.runSQL(sqlCmd)
  const currUser = getById(newUser.insertId)
  return currUser
}

function removeUser(userId) {
  var query = `DELETE FROM bug WHERE user._id = ${userId}`

  return DBService.runSQL(query).then((okPacket) =>
    okPacket.affectedRows === 1
      ? okPacket
      : Promise.reject(new Error(`No user deleted - user id ${userId}`)),
  )
}
function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

async function getById(userId) {
  var query = `SELECT * FROM user WHERE user._id = ${userId}`

  var users = await DBService.runSQL(query)
  console.log(users[0])
  if (users.length === 1) return users[0]
  throw new Error(`bug id ${userId} not found`)
}

async function checkLogin({ username, password }) {
  const users = await getUsers()
  let user = users.find(
    (user) => user.username === username && user.password === password,
  )
  if (user) {
    user = { ...user }
    delete user.password
  }
  return Promise.resolve(user)
}
function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

module.exports = {
  getById,
  getUsers,
  signup,
  removeUser,
  validateToken,
  checkLogin,
  getLoginToken,
}
