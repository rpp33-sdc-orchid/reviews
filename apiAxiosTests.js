const axios = require('axios');

// GET REVIEWS BY PRODUCT ID
axios({
  method: 'get',
  url: 'http://localhost:8000/reviews',
  params: {
    'page': 1,
    'count': 5,
    'sort': 'helpful',
    'product_id': 186
  },
}).then((success) => {
  console.log('get reviews by ID success');
})
  .catch((err) => console.log(err));

// GET REVIEWS METADATA
axios({
  method: 'get',
  url: 'http://localhost:8000/reviews/meta',
  params: {
    product_id: 186
  },
}).then((success) => {
  console.log('get reviews metadata success');
})
  .catch((err) => console.log(err));

// // POST NEW REVIEW
axios({
  method: 'post',
  url: 'http://localhost:8000/reviews',
  params: {
    product_id: 186,
    rating: 5,
    summary: 'TESTING',
    body: 'TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING ',
    recommend: 't',
    reviewer_name: 'TESTING',
    reviewer_email: 'TESTING@TESTING.COM',
    photos: '',
    characteristics: ''
  },
}).then((success) => {
  console.log('create new review success');
})
  .catch((err) => console.log(err));

//UPDATE REVIEW HELPFULNESS
axios({
  method: 'put',
  url: 'http://localhost:8000/reviews/:review_id/helpful',
  params: {
    review_id: 1
  },
}).then((success) => {
  console.log('update helpfulness success');
})
  .catch((err) => console.log(err));

// UPDATE REVIEW REPORT
axios({
  method: 'put',
  url: 'http://localhost:8000/reviews/:review_id/report',
  params: {
    review_id: 1
  },
}).then((success) => {
  console.log('update reported success');
})
  .catch((err) => console.log(err));