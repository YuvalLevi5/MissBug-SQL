const bugService = require('./BugService')

;(async () => {
  const name = 'play'
  const bugs = await bugService.query({ name })
  console.log('Bugs:', bugs)
})()
