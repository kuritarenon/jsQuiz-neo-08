const { test, expect } = require('@playwright/test');
const path = require('path');

const STUDENT_FILE = process.env.STUDENT_FILE;

test.beforeAll(() => {
  if (!STUDENT_FILE) throw new Error('STUDENT_FILE 環境変数が設定されていません');
});

function resolveFileUrl() {
  return `file://${path.resolve(__dirname, '..', STUDENT_FILE)}`;
}

const ALL = 'りんご、みかん、ぶどう、いぬ、ねこ、ぱんだ、ラーメン、すし、ケーキ';
const FRUIT = 'りんご、みかん、ぶどう';
const ANIMAL = 'いぬ、ねこ、ぱんだ';
const FOOD = 'ラーメン、すし、ケーキ';

// .result に表示されている文字列を返す。
async function getResult(page) {
  return (await page.textContent('.result')).trim();
}

test('初期状態ではすべての名前が表示されている', async ({ page }) => {
  await page.goto(resolveFileUrl());
  expect(await getResult(page)).toBe(ALL);
});

test('くだものボタンで fruit の名前だけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="fruit"]');
  expect(await getResult(page)).toBe(FRUIT);
});

test('どうぶつボタンで animal の名前だけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="animal"]');
  expect(await getResult(page)).toBe(ANIMAL);
});

test('たべものボタンで food の名前だけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="food"]');
  expect(await getResult(page)).toBe(FOOD);
});

test('表示されるのは絵文字ではなく名前（map での変換）', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="fruit"]');
  const text = await getResult(page);
  expect(text).toContain('りんご');
  expect(text).not.toContain('🍎');
});

test('「すべて」ボタンで全件表示に戻る', async ({ page }) => {
  await page.goto(resolveFileUrl());

  await page.click('.filter-buttons button[data-category="fruit"]');
  expect(await getResult(page)).toBe(FRUIT);

  await page.click('.filter-buttons .filter-all-btn');
  expect(await getResult(page)).toBe(ALL);
});

test('別カテゴリに切り替えると前のカテゴリの名前は残らない', async ({ page }) => {
  await page.goto(resolveFileUrl());

  await page.click('.filter-buttons button[data-category="fruit"]');
  expect(await getResult(page)).toBe(FRUIT);

  await page.click('.filter-buttons button[data-category="animal"]');
  const text = await getResult(page);
  expect(text).toBe(ANIMAL);
  expect(text).not.toContain('りんご');
});
