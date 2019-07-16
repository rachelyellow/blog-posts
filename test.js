const assert = require('assert')
const expect = require('chai').expect
const request = require('supertest')
const app = require('./server')

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();

chai.use(chaiHttp);

// PING =========================================================================================================

describe('Unit testing the /ping route', () => {
    it('it should GET ping', (done) => {
      chai.request(server)
          .get('/api/ping')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object').that.includes({ success: true });
            done();
          });
    });
});


// NO TAGS PARAMETER ============================================================================================

describe('Unit testing the /api/posts route with no search query', () => {
  it('should return error message when no tags parameter is provided', (done) => {
    chai.request(server)
        .get('/api/posts')
        .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.an('object').that.includes({ error: "Tags parameter is required" });
          done();
        });
  });
});


// HELPER FUNCTIONS =============================================================================================

const validTags = ['culture', 'design', 'health', 'history', 'politics', 'science', 'startups', 'tech']

function getSubArrays(arr) {
  if (arr.length === 1) {
    return [arr]
  } else {
    subarr = getSubArrays(arr.slice(1));
    return subarr.concat(subarr.map(e => e.concat(arr[0])), [[arr[0]]]);
  }
}

function commonElements(combination, post) {
  combination.forEach(function(tag) {
    if (post.tags.includes(tag)) {
      return true
    }
  })
  return false
}


// SEARCH QUERIES ===============================================================================================

describe('Unit testing the /api/posts route with search queries', () => {
  it('should return 200 OK status if there is at least one tags parameter provided', (done) => {
    chai.request(server)
        .get('/api/posts?tags=history,tech&sortBy=popularity&direction=desc')
        .end((err, res) => {
              res.should.have.status(200);
          done();
        });
  });

  it('should return an empty posts array when an invalid tag is queried', (done) => {
    chai.request(server)
        .get('/api/posts?tags=math')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.posts.should.be.an('array').that.is.empty;
          done();
        });
  });

  it('should return correct search results when a single valid tag is queried', (done) => {
    chai.request(server)
        .get('/api/posts?tags=history')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.posts.forEach((post) => {
                post.tags.should.contain('history')
              })
          done();
        });
  });

  it('should return correct search results when two valid tags are queried', (done) => {
    chai.request(server)
        .get('/api/posts?tags=history,tech')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.posts.forEach((post) => {
                // post.tags.should.have.any('history', 'tech')
              })
          done();
        });
  });
});



// describe('Unit testing the /api/posts route with search queries', function() {

//   it('should return 200 OK status if there is at least one tags parameter', function() {
//     return request(app)
//       .get('/api/posts?tags=history,tech&sortBy=popularity&direction=desc')
//       .then(function(response) {
//           assert.equal(response.status, 200)
//       })
//   })

//   it('should return an empty posts array when an invalid tag is queried', function() {
//     return request(app)
//     .get('/api/posts?tags=math')
//     .then(function(response) {
//         expect(response.body.posts).to.be.an('array').that.is.empty
//     })
//   })

//   it('should return correct search results when a single valid tag is queried', function() {
//     validTags.forEach(function(tag) {
//       return request(app)
//         .get(`/api/posts?tags=${tag}`)
//         .then(function(response) {
//           response.body.posts.forEach(function(post) {
//             expect(post.tags).to.contain(tag)
//           })
//         })
//     })
//   })
  

// // MULTIPLE QUERIES =============================================================================================

//   it('should return correct search results when any combination of valid tags is queried', function() {

//     let allTagCombinations = (getSubArrays(validTags))

//     allTagCombinations.forEach(function(combination) {
//       let tags = combination.toString()
//       return request(app)
//       .get(`/api/posts?tags=${tags}`)
//       .then(function(response) {
//         console.log("got tags!")
//         response.body.posts.forEach(function(post) {
//           expect(post.tags).to.contain("history")
//         })
//       })
//     })
//   })

// })


// turn array into comma separated string
// add string to get request
// check each resulting array element to contain at least one from the subarray

// SORTING ======================================================================================================

describe('Unit testing the /api/posts route for sort order', function() {  
  it('should return posts sorted by id in ascending order when no sortBy is present', function() {
    // return request(app)
    //   .get('/api/posts?')
    //   .then(function(response) {
    //       expect(response.body).to.contain({ "success": true })
    //   })
  })
  it ('should return 400 status with error message when an invalid request is made', function() {
    return request(app)
    .get('/api/posts')
  })
})
