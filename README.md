# Tetris Local Web App

ローカルで動くシンプルなブラウザ版テトリスです。

## 起動方法

### もっとも簡単な方法

`/Users/soyoo/Documents/Repo/Tetris/src/index.html` をブラウザで開く

### ローカルサーバーを使う方法

```bash
cd /Users/soyoo/Documents/Repo/Tetris/src
python3 -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。

## 操作方法

- `Enter`: 開始
- `←` / `→`: 左右移動
- `↓`: ソフトドロップ
- `↑` または `X`: 回転
- `Space`: ハードドロップ
- `P`: 一時停止 / 再開
- `R`: リスタート

## 実装済み機能

- テトリミノ7種
- 左右移動、回転、ソフトドロップ、ハードドロップ
- 自動落下
- ライン消去
- スコア、レベル、ライン数表示
- 次ブロック表示
- 一時停止
- ゲームオーバー
- リスタート

## ファイル構成

```text
docs/
  implementation-plan.md
  tetris-requirements.md
src/
  index.html
  styles/main.css
  scripts/
    board.js
    constants.js
    game.js
    input.js
    main.js
    pieces.js
    renderer.js
```
