const { test, expect } = require('@playwright/test');
const path = require('path');

const STUDENT_FILE = process.env.STUDENT_FILE;

test.beforeAll(() => {
  if (!STUDENT_FILE) throw new Error('STUDENT_FILE 環境変数が設定されていません');
});

function resolveFileUrl() {
  return `file://${path.resolve(__dirname, '..', STUDENT_FILE)}`;
}

const ALL =
  'スイス、ドイツ、オランダ、ベルギー、スペイン、フランス、イングランド、ノルウェー、オーストリア、ポルトガル、クロアチア、スウェーデン、ボスニア・ヘルツェゴビナ、ブラジル、アルゼンチン、コロンビア、エクアドル、パラグアイ、メキシコ、アメリカ、カナダ、南アフリカ、モロッコ、コートジボワール、エジプト、カーボベルデ、DRコンゴ、ガーナ、アルジェリア、セネガル、オーストラリア、日本';
const EUROPE = 'スイス、ドイツ、オランダ、ベルギー、スペイン、フランス、イングランド、ノルウェー、オーストリア、ポルトガル、クロアチア、スウェーデン、ボスニア・ヘルツェゴビナ';
const SOUTHAMERICA = 'ブラジル、アルゼンチン、コロンビア、エクアドル、パラグアイ';
const NORTHAMERICA = 'メキシコ、アメリカ、カナダ';
const AFRICA = '南アフリカ、モロッコ、コートジボワール、エジプト、カーボベルデ、DRコンゴ、ガーナ、アルジェリア、セネガル';
const ASIA = 'オーストラリア、日本';

// ギャラリー上に「表示されている（hidden が付いていない）」カードの国名を順に返す。
async function visibleNames(page) {
  const names = await page.$$eval('.card:not(.hidden) .card-name', (els) =>
    els.map((e) => e.textContent.trim())
  );
  return names.join('、');
}

test('初期状態ではすべてのカードが表示されている', async ({ page }) => {
  await page.goto(resolveFileUrl());
  expect(await visibleNames(page)).toBe(ALL);
});

test('ヨーロッパボタンで europe のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="europe"]');
  expect(await visibleNames(page)).toBe(EUROPE);
});

test('南米ボタンで southamerica のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="southamerica"]');
  expect(await visibleNames(page)).toBe(SOUTHAMERICA);
});

test('北中米ボタンで northamerica のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="northamerica"]');
  expect(await visibleNames(page)).toBe(NORTHAMERICA);
});

test('アフリカボタンで africa のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="africa"]');
  expect(await visibleNames(page)).toBe(AFRICA);
});

test('アジア・オセアニアボタンで asia のカードだけが表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="asia"]');
  expect(await visibleNames(page)).toBe(ASIA);
});

test('絞り込むと該当しないカードは hidden で隠れている', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await page.click('.filter-buttons button[data-category="europe"]');
  // ヨーロッパ13件だけ表示、残り19件は hidden
  expect(await page.locator('.card:not(.hidden)').count()).toBe(13);
  expect(await page.locator('.card.hidden').count()).toBe(19);
  // 日本（アジア）は隠れている
  await expect(page.locator('.card', { hasText: '日本' })).toBeHidden();
});

test('「すべて」ボタンで全件表示に戻る', async ({ page }) => {
  await page.goto(resolveFileUrl());

  await page.click('.filter-buttons button[data-category="europe"]');
  expect(await visibleNames(page)).toBe(EUROPE);

  await page.click('.filter-buttons .filter-all-btn');
  expect(await visibleNames(page)).toBe(ALL);
  expect(await page.locator('.card.hidden').count()).toBe(0);
});

test('別カテゴリに切り替えると前のカテゴリのカードは残らない', async ({ page }) => {
  await page.goto(resolveFileUrl());

  await page.click('.filter-buttons button[data-category="europe"]');
  expect(await visibleNames(page)).toBe(EUROPE);

  await page.click('.filter-buttons button[data-category="southamerica"]');
  expect(await visibleNames(page)).toBe(SOUTHAMERICA);
  // ヨーロッパのカードは隠れている
  await expect(page.locator('.card', { hasText: 'スイス' })).toBeHidden();
});
