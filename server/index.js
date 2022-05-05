const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const db = require('../database/index.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(express.static('loaderio'));

app.get('/', (request, response) => {
  response.json('HR-RPP33 SDC Home Page');
})

app.get('/reviews', db.getReviews);
app.get('/reviews/meta', db.getReviewsMetadata);
app.post('/reviews', db.createReview);
app.put('/reviews/:review_id/helpful', db.updateHelpful);
app.put('/reviews/:review_id/report', db.updateReport);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})

module.exports = app;
