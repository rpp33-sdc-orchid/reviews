const Pool = require('pg').Pool
const pool = new Pool({
  user: 'Dennis',
  host: 'localhost',
  database: 'sdc_reviews',
  password: '',
  port: 5432,
})

// GET
const getReview = (request, response) => {
  pool.query('SELECT * FROM review ORDER BY id ASC LIMIT 10', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// CONDITIONAL GET
const getReviewById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('SELECT * FROM review WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

// POST
// const createUser = (request, response) => {
//   const { name, email } = request.body

//   pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(201).send(`User added with ID: ${result.insertId}`)
//   })
// }

// UPDATE
// const updateUser = (request, response) => {
//   const id = parseInt(request.params.id)
//   const { name, email } = request.body

//   pool.query(
//     'UPDATE users SET name = $1, email = $2 WHERE id = $3',
//     [name, email, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).send(`User modified with ID: ${id}`)
//     }
//   )
// }

// DELETE
// const deleteUser = (request, response) => {
//   const id = parseInt(request.params.id)

//   pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).send(`User deleted with ID: ${id}`)
//   })
// }

module.exports = {
  getReview,
  getReviewById
  // getUsers,
  // getUserById,
  // createUser,
  // updateUser,
  // deleteUser,
};