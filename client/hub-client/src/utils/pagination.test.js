import test from 'node:test';
import assert from 'node:assert/strict';
import { clampPage, getPageItems, getTotalPages } from './pagination.js';

test('creates a new page after every 10 rows', () => {
  assert.equal(getTotalPages(10, 10), 1);
  assert.equal(getTotalPages(11, 10), 2);
  assert.equal(getTotalPages(235, 10), 24);
});

test('returns only the rows on the selected page', () => {
  const rows = Array.from({ length: 25 }, (_, index) => index + 1);

  assert.deepEqual(getPageItems(rows, 1, 10), rows.slice(0, 10));
  assert.deepEqual(getPageItems(rows, 2, 10), rows.slice(10, 20));
  assert.deepEqual(getPageItems(rows, 3, 10), rows.slice(20, 25));
});

test('clamps the current page when rows are removed', () => {
  assert.equal(clampPage(3, 19, 10), 2);
  assert.equal(clampPage(2, 0, 10), 1);
});
