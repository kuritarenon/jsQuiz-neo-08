const { test, expect } = require('@playwright/test');
const path = require('path');

const STUDENT_FILE = process.env.STUDENT_FILE;

test.beforeAll(() => {
  if (!STUDENT_FILE) throw new Error('STUDENT_FILE 環境変数が設定されていません');
});

function resolveFileUrl() {
  return `file://${path.resolve(__dirname, '..', STUDENT_FILE)}`;
}

const ALL = ['りんご', 'みかん', 'ぶどう', 'いぬ', 'ねこ', 'ぱんだ', 'ラーメン', 'すし', 'ケーキ'];
const FRUIT = ['りんご', 'みかん', 'ぶどう'];
const ANIMAL = ['いぬ', 'ねこ', 'ぱんだ'];
const FOOD = ['ラーメン', 'すし', 'ケーキ'];

// .gallery に描画されている .card の名前を DOM 順で返す。
async function getCardNames(page) {
  return await page.$$eval('.gallery .card .card-name', (els) =>
    els.map((el) => el.textContent.trim())
  );
}

// .gallery に描画されている .card の絵文字を DOM 順で返す。
async function getCardEmojis(page) {
  return await page.$$eval('.gallery .card .card-emoji', (els) =>
    els.map((el) => el.textContent.trim())
  );
}

test('初期状態ではすべての絵文字カードが表示されている', async ({ page }) => {
  await page.goto(resolveFileUrl());
  expect(await getCardNames(page)).toEqual(ALL);
});

test('くだものボタンで fruit のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="fruit"]');
  expect(await getCardNames(page)).toEqual(FRUIT);
});

test('どうぶつボタンで animal のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="animal"]');
  expect(await getCardNames(page)).toEqual(ANIMAL);
});

test('たべものボタンで food のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="food"]');
  expect(await getCardNames(page)).toEqual(FOOD);
});

test('カードには絵文字も正しく描画されている（map での変換）', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="fruit"]');
  expect(await getCardEmojis(page)).toEqual(['🍎', '🍊', '🍇']);
});

test('「すべて表示」ボタンでフィルタが解除され全件表示に戻る', async ({ page }) => {
  await page.goto(resolveFileUrl());

  // 一度カテゴリで絞り込む
  await page.click('.filter-buttons button[data-category="fruit"]');
  expect(await getCardNames(page)).toEqual(FRUIT);

  // 「すべて表示」で全件に戻る（前のフィルタが残らないこと）
  await page.click('.filter-buttons .filter-all-btn');
  expect(await getCardNames(page)).toEqual(ALL);
});

test('別カテゴリに切り替えると前のカテゴリのカードは残らない', async ({ page }) => {
  await page.goto(resolveFileUrl());

  await page.click('.filter-buttons button[data-category="fruit"]');
  expect(await getCardNames(page)).toEqual(FRUIT);

  await page.click('.filter-buttons button[data-category="animal"]');
  const names = await getCardNames(page);
  expect(names).toEqual(ANIMAL);
  expect(names).not.toContain(FRUIT[0]);
});
