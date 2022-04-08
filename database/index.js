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
  const sort = request.params.sort === 'relevant' ? 'helpfulness DESC, DATE DESC' : request.params.sort === 'helpful' ? 'helpfulness DESC' : 'date DESC';
  const count = parseInt(request.params.count);
  const page = parseInt(request.params.count);
  pool.query(`SELECT json_build_object(
    'product', ${product_id},
    'page', ${page},
    'count', ${count},
    'results', json_agg(
      json_build_object(
        'review_id', r.id,
        'rating', r.rating,
        'summary', r.summary,
        'recommend', r.recommend,
        'response', r.response,
        'body', r.body,
        'date', r.date,
        'reviewer_name', r.reviewer_name,
        'helpfulness', r.helpfulness,
        'photos', (SELECT coalesce(json_agg(
                    json_build_object(
                      'id', id,
                      'url', url
                  )), '[]'::json) AS Photos FROM photo WHERE r.id = review_id
        )
      ) ORDER BY ${sort}
    )
  )
  FROM review r
  WHERE r.product_id IN ($1)
  LIMIT ${count}`, [product_id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

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
  getReviewsMetadata,
  createReview,
  updateHelpful,
  updateReport
};