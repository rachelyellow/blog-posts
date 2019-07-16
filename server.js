const express     = require('express')
const bodyParser  = require('body-parser')

// const app = require('./app/routes/controller')
const app = express()
const PORT = 3000
const http = require('http')

// require('./app/routes')(app, {})
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())


function getPosts(options, cb) {
  http.request(options, function (res) {
    let body = '' 
    res.on('data', function (chunk) {
      body += chunk
    })
    res.on('end', () => {
      const result = JSON.parse(body)
      cb(null, result)
    })
    res.on('error', cb)
  })
  .on('error', cb)
  .end()
}

// takes in all search results and returns array with filtered posts to remove duplicates
function removeDupes(arr) {
  let filteredPosts = []
  const uniqueIDs = []
  arr.forEach(function(post) {
    if (!uniqueIDs.includes(post.id)) {
      uniqueIDs.push(post.id)
      filteredPosts.push(post)
    }
  })
  return filteredPosts
}

function sortValues(arr, sortBy, dir) {
  if (dir === 'desc') {
    return arr.sort((a, b) => b[sortBy] - a[sortBy])
  } else {
    return arr.sort((a, b) => a[sortBy] - b[sortBy])
  }
}

app.get('/api/ping', (req, res, next) => {
  res.status(200).json({ "success": true })
})

app.get ('/api/posts', (req, res, next) => {
  
  const query = req.query
  const sortOptions = ['id', 'reads', 'likes', 'popularity']

  if (query.tags === undefined || query.tags === '') {
    res.status(400).json({ "error": "Tags parameter is required" })
  } else if (query.sortBy === '' || !sortOptions.includes(query.sortBy) && !query.sortBy === undefined) {
    res.status(400).json({ "error": "sortBy parameter is invalid." })
  } else if (query.direction === '' || query.direction && !['asc', 'desc'].includes(query.direction)) {
    res.status(400).json({ "error": "direction parameter is invalid." })
  } else {

    let returnObj = { "posts": [] }
    const tags = query.tags.split(',')
  
    for (let i = 0; i < tags.length; i++) {
      let options = {
        host: 'hatchways.io',
        path: '/api/assessment/blog/posts?tag=' + tags[i]
      }
      getPosts(options, function (err, result) {
        if (err) {
          console.log(err)
        }
        returnObj.posts = returnObj.posts.concat(result.posts)
        if (i === tags.length - 1) {
          returnObj.posts = sortValues(removeDupes(returnObj.posts), query.sortBy ? query.sortBy : 'id', query.direction)
          res.send(returnObj)
        }
      })
    }
  }
})


module.exports = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})