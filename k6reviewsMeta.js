import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
}
export default function () {
  let randomProductID = Math.floor(Math.random() * (300000));

  let getReviewsMeta = http.get(`http://localhost:8000/reviews?product_id=186`);
  check(getReviewsMeta, { "getReviews succeeded with status 200": (r) => r.status == 200 })
  sleep(0.1);
}