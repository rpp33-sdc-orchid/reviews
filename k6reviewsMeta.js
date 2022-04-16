import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
}
export default function () {
  let randomProductID = Math.floor(Math.random() * (300000));

  http.get(`http://localhost:8000/reviews?product_id=186`);
  sleep(0.1);
}