const Pool = require('pg').Pool
const pool = new Pool({
  user: 'ubuntu',
  host: 'ec2-54-81-118-70.compute-1.amazonaws.com',
  database: 'sdc_reviews',
  password: 'ubuntu',
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
  WHERE r.reported = 'f' AND r.product_id IN ($1) LIMIT ${count}`, [product_id], (error, success) => {
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
    } else if (success.rows[0]) {
      response.status(200).json(success.rows[0].json_build_object);
    } else {
      response.status(200).json('This product has no metadata.');
    }

  })
};

// POST NEW REVIEW
const createReview = (request, response) => {
  const { product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, photos, characteristics } = request.body
  const date = Date.now();
  pool.query(`INSERT INTO review (
    product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness
    ) VALUES (
      ${product_id}, ${rating}, ${date}, '${summary}', '${body}', '${recommend}', 'f', '${reviewer_name}', '${reviewer_email}', 0
      )`, (error, reviewSuccess) => {
    if (error) {
      throw error;
    }
    if (photos.length > 0) {  //loop more than 1 photo?
      pool.query('INSERT INTO photo (review_id, url) VALUES ($1, $2)', [reviewSuccess.rows[0].id, photo.url], (error, photoSuccess) => {
        if (error) {
          throw error;
        }
        // response.status(201).send(photoSuccess);
      })
    }
    if (Object.keys(characteristics).length > 0) {
      for (let key in characteristics) {
        pool.query(`INSERT INTO review_characteristic (characteristic_id, review_id, value) VALUES ((SELECT id FROM characteristic WHERE (product_id=${product_id} AND name = $2)), $1, $3)`, [reviewSuccess.rows[0].id, key, characteristics[key].value], (error, characteristicSuccess) => {
          if (error) {
            throw error;
          }
          // response.status(201).send(characteristicSuccess);
        })
      }
    }
    response.status(201).send(reviewSuccess);
  })
}

// UPDATE REVIEW HELPFULNESS
const updateHelpful = (request, response) => {
  const review_id = request.query.review_id;

  pool.query(
    'UPDATE review SET helpfulness = helpfulness + 1 WHERE id = $1',
    [review_id],
    (error, success) => {
      if (error) {
        throw error;
      }
      response.status(204).send(success);
    }
  )
}

// UPDATE REVIEW REPORTED
const updateReport = (request, response) => {
  const review_id = request.query.review_id;

  pool.query(
    `UPDATE review SET reported = 't' WHERE id = $1`,
    [review_id],
    (error, success) => {
      if (error) {
        throw error;
      }
      response.status(204).send(success);
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