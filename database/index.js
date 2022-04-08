const Pool = require('pg').Pool
const pool = new Pool({
  user: 'Dennis',
  host: 'localhost',
  database: 'sdc_reviews',
  password: '',
  port: 5432,
})

// GET REVIEWS BY PRODUCT ID
const getReviews = (request, response) => {
  const product_id = request.query.product_id;
  const page = request.query.page || 1;
  const sort = request.query.sort === 'relevant' ? 'helpfulness DESC, DATE DESC' : request.params.sort === 'helpful' ? 'helpfulness DESC' : 'date DESC';
  const count = request.query.count || 5;

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
  LIMIT ${count}`, [product_id], (error, success) => {
    if (error) {
      throw error;
    }
    response.status(200).json(success.rows[0].json_build_object);
  })
}

// GET REVIEW METADATA
const getReviewsMetadata = (request, response) => {
  const product_id = request.query.product_id;

  pool.query(`SELECT json_build_object(
    'product_id', product_id,
    'ratings',
      (SELECT json_object_agg(
        rating,
        review_count
      )
      FROM
        (SELECT
          rating,
          count(*) AS review_count
        FROM review
        WHERE product_id =$1
        GROUP BY rating
      ) r),
    'recommended',
      (SELECT json_object_agg(
        recommend,
        review_count)
      FROM (
        SELECT
          recommend,
          count(*) AS review_count
        FROM review
        WHERE product_id = $1
        GROUP BY recommend
      ) re),
    'characteristics',
      (SELECT json_object_agg(
        name, json_build_object(
            'id', id,
            'value', value
      ))
      FROM (
        SELECT c.name,
              c.id,
              sum(value)/count(*) AS value
        FROM characteristic c
        LEFT JOIN review_characteristic rc
        ON c.id = rc.characteristic_id
        WHERE c.product_id = $1
        GROUP BY  c.name, c.id
        ) r
    )
  )
  FROM review
  WHERE product_id = $1`, [product_id], (error, success) => {
    if (error) {
      throw error;
    }
    response.status(200).json(success.rows[0].json_build_object);
  })
};

// POST NEW REVIEW
const createReview = (request, response) => {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = request.body

  pool.query('INSERT INTO review (product_id, rating, summary, body, recommend, name, email, photos, characteristics) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [product_id, rating, summary, body, recommend, name, email, photos, characteristics], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).send(`Review added with ID: ${result.insertId}`);
  })
}

// UPDATE REVIEW HELPFULNESS
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

// UPDATE REVIEW REPORTED
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

module.exports = {
  getReviews,
  getReviewsMetadata,
  createReview,
  updateHelpful,
  updateReport
};