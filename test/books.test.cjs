const { test, before, after } = require('node:test');
const assert = require('node:assert');

let server, base;

before(() => {
  process.env.PORT = '0';
  ({ server } = require('../api/server'));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /api/books → list with count >= 3', async () => {
  const res = await fetch(`${base}/api/books`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.ok(Array.isArray(json.items));
  assert.ok(Number.isInteger(json.count));
  assert.ok(json.count >= 3);
});
