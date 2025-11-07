const { test, before, after } = require('node:test');
const assert = require('node:assert');

let server, base;

before(() => {
  process.env.PORT = '0';              // ask OS for a free port
  ({ server } = require('../api/server'));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /api/health → 200 {status:"ok"}', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.status, 'ok');
});
