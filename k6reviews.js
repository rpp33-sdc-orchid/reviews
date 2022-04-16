import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '60s'
  // scenarios: {
  //   constant_request_rate: {
  //     executor: 'constant-arrival-rate',
  //     rate: 100,
  //     timeUnit: '1s',
  //     duration: '30s',
  //     preAllocatedVUs: 100,
  //     maxVUs: 1000
  //   },
  // }
}
export default function () {
  let sort = ['helpful', 'newest', 'relevant']
  let randomProductID = Math.floor(Math.random() * (10000));
  let randomPage = Math.floor(Math.random() * 5);
  let randomSort = sort[Math.floor(Math.random() * sort.length)];;
  let randomCount = Math.floor(Math.random() * 10);

  let getReviews = http.get(`http://localhost:8000/reviews?product_id=2&page=1&sort=helpful&count=3`);
  check(getReviews, { "getReviews succeeded with status 200": (r) => r.status == 200 })
  sleep(0.1);
}