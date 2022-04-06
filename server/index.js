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

app.get('/reviews', db.getReviews)
app.get('/reviews/:product_id/:sort/:count', db.getReviewsByParams)
// app.post('/reviews', db.createUser)
// app.put('/reviews/:id', db.updateUser)
// app.put('/reviews/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
})
