const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('puki-is-the-best-919121123')

const users = require('../data/user.json')
const bugs = require('../data/bug.json')


module.exports = {
    checkLogin,
    signup,
    getLoginToken,
    validateToken,
    getUsers,
    removeUser,
}

function getUsers() {
    return Promise.resolve(users)
}

function removeUser({ userId }) {
    const idx = users.findIndex(currUser => currUser._id === userId)
    const ownBugs = bugs.some(bug => bug.creator._id === userId)
    if (ownBugs) {
        console.error('Cannot delete user with bugs!');
        return Promise.reject()
    } else {
        users.splice(idx, 1)
        console.log('User deleted successfully');
        return _saveUserToFile()
    }
}


function checkLogin({ username, password }) {
    let user = users.find(user => user.username === username && user.password === password)
    if (user) {
        user = { ...user }
        delete user.password
    }
    return Promise.resolve(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function signup({ fullname, username, password }) {
    let user = {
        _id: _makeId(),
        fullname,
        username,
        password,
        isAdmin: false,
    }
    users.push(user)

    return _saveUserToFile()
        .then(() => {
            user = { ...user }
            delete user.password
            return user
        })
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


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveUserToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(users, null, 2)
        fs.writeFile('./data/user.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}