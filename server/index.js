const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('../database/index.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
})

app.get('/reviews/:product_id/:sort/:page/:count', db.getReviews);
app.get('/reviews/meta/:product_id', db.getReviewsMetadata);
app.post('/reviews/createReview', db.createReview);
app.put('/reviews/:review_id/helpful', db.updateHelpful);
app.put('/reviews/:reviews_id/report', db.updateReport);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})
