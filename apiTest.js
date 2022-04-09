const axios = require('axios');

axios({
  method: 'get',
  url: 'http://localhost:8000/reviews',
  params: {
    'page': 1,
    'count': 10,
    'sort': 'helpful',
    'product_id': 1
  },
  query: {
    'page': 1,
    'count': 100000,
    'sort': 'helpful',
    'product_id': 1
  },
}).then((response) => {
  console.log('SUCCESS :3');
})
  .catch((err) => console.log(err));