const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/BugServiceSQL')
const userService = require('./services/UserServiceSQL')
const app = express()
const port = process.env.PORT || 3030
const path = require('path')

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to Bug Life Server')
})

app.get('/api/user', (req, res) => {
  userService
    .getUsers()
    .then((users) => res.send(users))
    .catch((err) => console.error(err))
})

app.delete('/api/user/:userId', (req, res) => {
  const userId = req.params
  userService
    .removeUser(userId)
    .then(() => res.send('User Removed!'))
    .catch((err) => res.status(500).send('Cannot remove user'))
})

//user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const credential = {
    username,
    password,
  }

  userService.checkLogin(credential).then((user) => {
    if (user) {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    } else {
      res.status(401).send('Invalid credentials')
    }
  })
})

//user logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Logged out')
})

//signup
app.post('/api/signup', (req, res) => {
  const { fullname, username, password } = req.body
  const signupInfo = {
    fullname,
    username,
    password,
    isAdmin: false,
  }
  userService.signup(signupInfo).then((user) => {
    const loginToken = userService.getLoginToken(user)
    res.cookie('loginToken', loginToken)
    res.send(user)
  })
})

//list
app.get('/api/bug', (req, res) => {
  const { bySeverity, pageIdx = 0 } = req.query

  const filterBy = {
    bySeverity,
    pageIdx,
  }

  bugService
    .query(filterBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => res.status(500).send('Cannot get bugs'))
})

//create
app.post('/api/bug', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  const { description, title, severity } = req.body
  const bug = {
    description,
    title,
    severity,
    creator_id: loggedInUser._id,
  }
  console.log(bug)
  bugService
    .save(bug)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => res.status(500).send('Cannot get bug'))
})

//update
app.put('/api/bug/:bugId', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedInUser && !loggedInUser.isAdmin)
    return res.status(401).send('Cannot update bug')
  const { _id, description, title, creator, severity } = req.body
  const bug = {
    _id,
    description,
    title,
    severity,
    creator,
  }
  bugService
    .save(bug, loggedInUser)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => res.status(401).send('Cannot update bug'))
})

///read
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  let visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')
  if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
  res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7000 })
  if (visitedBugs.length > 3) {
    console.log(
      'user visited the top amount of bugs, you can revisit them only:',
      visitedBugs,
    )
    return res.status(401).send('Cannot get more bugs')
  }

  const { loginToken } = req.cookies
  const user = userService.validateToken(loginToken)
  if (!user) return res.status(401).send('Unauthorized')

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => res.status(500).send('Cannot get bug'))
})

//delete
app.delete('/api/bug/:bugId', (req, res) => {
  const loggedInUser = userService.validateToken(req.cookies.loginToken)
  console.log('user admin?', loggedInUser)
  if (!loggedInUser && !loggedInUser.isAdmin)
    return res.status(401).send('Cannot delete bug')
  const { bugId } = req.params
  bugService
    .remove(bugId, loggedInUser)
    .then(() => res.send('Removed'))
    .catch((err) => {
      res.status(401).send('Only creator can delete bug')
    })
})

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
app.listen(port, () => {
  console.log(`Server ready at port: http://localhost:${port}/#/bug !`)
})
