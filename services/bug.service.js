const fs = require('fs')
const bugs = require('../data/bug.json')

const PAGE_SIZE = 6


module.exports = {
    query,
    getById,
    remove,
    save
}


function query(filterBy) {
    const regex = new RegExp(filterBy.bySeverity, 'i')
    let filteredBugs = bugs.filter(bug => regex.test(bug.severity))

    // const startIdx = filterBy.pageIdx * PAGE_SIZE
    // filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    console.log(filteredBugs);
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedInUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (loggedInUser._id !== bugs[idx].creator._id && !loggedInUser.isAdmin) {
        console.log(loggedInUser, bugs[idx].creator);
        return Promise.reject()
    }
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (idx === -1) return Promise.reject('No such car')

        if (bugs[idx].creator._id !== loggedinUser._id) {
            return Promise.reject('Not your car')
        }
        bugs[idx] = bug
    } else {
        bug._id = _makeId()
        bug.createdAt = Date.now()
        bugs.push(bug)
    }
    return _saveBugsToFile()
        .then(() => bug)
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(bugs, null, 2)
        fs.writeFile('./data/bug.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}