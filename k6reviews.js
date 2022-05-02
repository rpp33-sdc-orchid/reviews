import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '60s'
  // scenarios: {
  //   constant_request_rate: {
  //     executor: 'constant-arrival-rate',
  //     rate: 1000,
  //     timeUnit: '1s',
  //     duration: '60s',
  //     preAllocatedVUs: 2000,
  //     maxVUs: 50000
  //   },
  // }
}
export default function () {
  let sort = ['helpful', 'newest', 'relevant']
  let randomProductID = Math.floor(Math.random() * (10000));
  let randomPage = Math.floor(Math.random() * 10);
  let randomSort = sort[Math.floor(Math.random() * sort.length)];;
  let randomCount = Math.floor(Math.random() * 50);

  let getReviews = http.get(`http://localhost:8000/reviews?product_id=186&page=1&sort=helpful&count=3`);
  check(getReviews, { "/reviews succeeded with status 200": (r) => r.status == 200 })
  sleep(0.1);
}