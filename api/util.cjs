// api/util.cjs
const crypto = require('crypto');
function newId() { return crypto.randomUUID(); }
function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }
function validateBookPayload(body) {
  const { title, author, year } = body || {};
  if (!isNonEmptyString(title))  return { ok: false, msg: 'title required' };
  if (!isNonEmptyString(author)) return { ok: false, msg: 'author required' };
  if (year !== undefined && !Number.isInteger(year)) return { ok: false, msg: 'year must be integer' };
  return { ok: true };
}
module.exports = { newId, validateBookPayload };
