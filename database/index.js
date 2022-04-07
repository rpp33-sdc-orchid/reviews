const Pool = require('pg').Pool
const pool = new Pool({
  user: 'Dennis',
  host: 'localhost',
  database: 'sdc_reviews',
  password: '',
  port: 5432,
})

// GET ALL
const getReviews = (request, response) => {
  const product_id = parseInt(request.params.product_id);
  pool.query(`SELECT id, product_id, rating, summary, recommend, response, body, date, reported, reviewer_name, review_email, response, helpfulness
      (
        SELECT array_to_json(array_agg(row_to_json(a)))
        FROM (
          SELECT id, url
          FROM photo
          WHERE review_id=review.id
          ORDER BY POSITION ASC
        ) a
      ) AS photo
    FROM review
    WHERE product_id = ${product_id}`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

// CONDITIONAL GET
const getReviewsByParams = (request, response) => {

  const product_id = parseInt(request.params.product_id);
  const sort = request.params.sort;
  const count = parseInt(request.params.count);
  if (sort === 'newest') {
    pool.query('SELECT * FROM review WHERE product_id = $1 ORDER BY date DESC LIMIT $2', [product_id, count], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    })
  } else if (sort === 'helpful') {
    pool.query('SELECT * FROM review WHERE product_id = $1 ORDER BY helpfulness DESC LIMIT $2', [product_id, count], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
      console.log(results.rows);
    })
  } else if (sort === 'relevant') {
    pool.query('SELECT * FROM review WHERE product_id = $1 ORDER BY helpfulness DESC LIMIT $2', [product_id, count], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  } else {
    response.status(404).json('Error: Incorrect GET parameters provided.');
  }
};

// GET METADATA
const getReviewsMetadata = (request, response) => {
  const product_id = parseInt(request.params.product_id);

  pool.query('SELECT * FROM review WHERE product_id = $1 ??????', [product_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
};

// POST
const createReview = (request, response) => {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = request.body

  pool.query('INSERT INTO review (product_id, rating, summary, body, recommend, name, email, photos, characteristics) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [product_id, rating, summary, body, recommend, name, email, photos, characteristics], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Review added with ID: ${result.insertId}`);
  })
}

// UPDATE
const updateHelpful = (request, response) => {
  const review_id = parseInt(request.params.review_id)
  const helpfulness = request.body;

  pool.query(
    'UPDATE review SET helpfulness = $1 WHERE id = $2',
    [helpfulness, review_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Review modified with ID: ${review_id}`);
    }
  )
}

// UPDATE
const updateReport = (request, response) => {
  const review_id = parseInt(request.params.review_id)
  const reported = request.body;

  pool.query(
    'UPDATE review SET reported = $1 WHERE id = $2',
    [reported, review_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Review modified with ID: ${review_id}`);
    }
  )
}

// DELETE
// const deleteReview = (request, response) => {
//   const id = parseInt(request.params.id)

//   pool.query('DELETE FROM review WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).send(`User deleted with ID: ${id}`)
//   })
// }

module.exports = {
  getReviews,
  getReviewsByParams,
  getReviewsMetadata,
  createReview,
  updateHelpful,
  updateReport
};