const request = require('supertest')
const app = require('./index.js')

describe("GET /reviews", () => {
  test('fetched reviews for a product', (done) => {
    request(app)
      .get('/reviews')
      .query({ product_id: 186, page: 1, sort: 'helpful', count: 3 })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})

describe("GET /reviews/meta", () => {
  test('fetched reviews metadata for a product', (done) => {
    request(app)
      .get('/reviews/meta')
      .query({ product_id: 186 })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})


describe("POST /reviews", () => {
  test('created a new review', (done) => {
    request(app)
      .post('/reviews')
      .expect('Content-Type', /json/)
      .send({
        product_id: 186,
        rating: 5,
        summary: 'testing summary',
        body: 'testing body',
        recommend: 't',
        reviewer_name: 'tester',
        reviewer_email: 'testeremail@testing.com',
        photos: '',
        characteristics: ''
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})

describe("PUT /reviews/:review_id/helpful", () => {
  test('updated review helpfulness value', (done) => {
    request(app)
      .put('/reviews/:review_id/helpful')
      .query({ review_id: 1 })
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})

describe("PUT /reviews/:review_id/report", () => {
  test('updated review reported status', (done) => {
    request(app)
      .put('/reviews/:review_id/report')
      .query({ review_id: 1 })
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      })
  })
})
