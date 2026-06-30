# jsQuiz-neo-08

「`map` と `filter` を使ったデータの絞り込み・変換と描画」の振り返りです。

## 課題内容

カテゴリボタンを押したとき、そのカテゴリの絵文字（`items`）だけを `filter` で絞り込み、`map` でカード HTML に変換してギャラリーに表示します。「すべて表示」ボタンですべての絵文字カードを表示に戻します。

**データ（`items`）とカードを作る関数（`cardHtml`）は `index.html` にすでに用意してあります。**
あなたの課題は、**`filter` で絞り込み → `map(cardHtml)` で変換 → 描画する処理を書き、各ボタンに `click` イベントを設定する**ことです。

<!-- ![Quiz8の課題](./sample.gif) -->

### HTML の構造（ひな形）

- フィルターボタン群 `.filter-buttons` の中に4つの `<button class="filter-btn">`
  - 「すべて表示」… `.filter-btn.filter-all-btn`（`data-category` なし）
  - 「くだもの」… `<button class="filter-btn" data-category="fruit">`
  - 「どうぶつ」… `<button class="filter-btn" data-category="animal">`
  - 「たべもの」… `<button class="filter-btn" data-category="food">`
- ギャラリー `.gallery`（ここに `.card` を描画する。初期状態は全件表示）
- カード1枚は `<div class="card">` の中に `.card-emoji`（絵文字）と `.card-name`（名前）

### 用意済みのデータ・関数（書き換えないこと）

`index.html` の `<script>` 前半に、以下がすでに定義されています。

```js
const items = [ { name, emoji, category }, ... ]; // 絵文字データの配列
const gallery = document.querySelector('.gallery');
const buttons = document.querySelectorAll('.filter-btn');

cardHtml(item)  // データ1件を受け取り、カード1枚分の HTML 文字列を返す
```

初期表示（全件）も用意済みです（`gallery.innerHTML = items.map(cardHtml).join('');`）。
これらは完成済みなので、**自分で作り直さないでください**（中身を変更しないでください）。

### あなたの課題

1. 指定したカテゴリの絵文字だけを表示する関数 `showByCategory(category)` を作る。
   - `items` を `filter()` で「`category` が一致するものだけ」に絞り込み、
   - その結果を `map(cardHtml)` でカード HTML に変換し、`join('')` でつなげて、
   - `gallery.innerHTML` に入れる。
2. `.filter-btn` の各ボタン（変数 `buttons`）に `click` イベントを設定する。

| ボタン | 動作 |
|---|---|
| くだもの（`data-category="fruit"`） | `showByCategory('fruit')` |
| どうぶつ（`data-category="animal"`） | `showByCategory('animal')` |
| たべもの（`data-category="food"`）  | `showByCategory('food')` |
| すべて表示（`.filter-all-btn`） | 全件をカードにして表示し直す |

**別のカテゴリに切り替えたとき、前のカテゴリのカードが残らないこと**（毎回 `gallery.innerHTML` を作り直せば自動的にそうなります）。

---

## 制作手順（ヒント）

用意済みの処理より**後ろ**に、次の処理を書きます。

1. `showByCategory(category)` を定義する
   ```js
   const showByCategory = function (category) {
     gallery.innerHTML = items
       .filter(function (item) { return item.category === category; })
       .map(cardHtml)
       .join('');
   };
   ```
2. `buttons.forEach(function (btn) { ... })` で各ボタンを順番に処理する
3. ループの中で `btn.addEventListener('click', function () { ... })` を設定する
4. クリック時の処理:
   - `const category = btn.getAttribute('data-category');`
   - `category` があれば `showByCategory(category)` を呼ぶ
   - `category` がなければ（＝「すべて表示」ボタン）`gallery.innerHTML = items.map(cardHtml).join('');`

`items` / `buttons` / `cardHtml` はすでに使える状態なので、新しく宣言し直さないでください。

---

## 提出方法

### ① Fork
このリポジトリを自分のアカウントに Fork してください。

### ② clone
自分の Fork を GitHub Desktop で clone します。

### ③ branch を作る
ブランチ名に「quiz8/自分の名前」を記入する（例：quiz8/kawaguchi）

### ④ コードを書く
`students/{自分の番号}/index.html` を編集して課題を完成させます。
（例：出席番号が 7 番なら `students/7/index.html`）

ルートの `index.html` を `students/{自分の番号}/index.html` にコピーしてから編集するのが簡単です。

### ⑤ commit / push
変更を commit して push してください。
- title：出席番号_名前（例：28_河口）
- message：提出します。

### ⑥ Pull Request を作成
元のリポジトリに向けて Pull Request を作成してください。

## 判定について

- Pull Request を出すと自動判定が実行されます
- 成功 → ✅ **合格！** のコメントが付きます
- 失敗 → ❌ **不合格** のコメントと確認ポイントが付きます

結果は PR のコメント欄と「Checks」タブで確認してください。

## ディレクトリ構成

```
jsQuiz-neo-08/
├── index.html              # 問題ファイル（参照・複製元）
├── students/               # 解答フォルダ ★ここに作業する
│   └── {自分の番号}/
│       └── index.html      # index.html を複製して解答を記述
├── .github/                # 自動判定の設定（触らない）
├── tests/                  # 自動判定の設定（触らない）
├── playwright.config.js    # 自動判定の設定（触らない）
└── README.md
```

## 注意

- `students/{自分の番号}/index.html` の `<script>` 内、**「ここから下があなたの課題です」より後ろ**だけ編集してください
- 用意済みのデータ・関数（`items` / `buttons` / `cardHtml`）は書き換えないでください
- HTML構造（`.filter-buttons` / `.filter-btn` / `.filter-all-btn` / `.gallery` / `.card` / `data-category`）は変えないでください
- `items` の `category` の値（`fruit` / `animal` / `food`）は変更しないでください
- `students/` 以外のファイルは変更しないでください
- エラーが出たら修正して再度 push してください

---

## 模範解答

授業資料の[JSQuiz_neo模範解答](https://2026doc.hideok.org/first-term/javascript/post-quizanswer)
