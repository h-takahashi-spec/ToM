# 先生のおやつはどれ？ ― Cheryl's Birthday 型パズル（授業用オンライン課題）

心の理論の講義の導入に使う、学生が個人で取り組むオンライン課題です（時間制限なし）。
Cheryl's Birthday と同じ論理構造で、設定（お菓子の種類×味）と登場人物はオリジナルです。そのため、ネット上の原題の答えはそのまま使えません。

## フォルダ構成

| 場所 | 中身 | 公開 |
|---|---|---|
| `public/index.html` | 学生が回答するページ | **GitHub Pages で公開** |
| `public/results.html` | 授業中にスクリーンに映す集計ページ | 公開（正解は含まない） |
| `teacher/apps_script.gs` | 回答をスプレッドシートに記録し、正誤を判定するスクリプト | **公開しない**（正解が書いてある） |
| `teacher/verify.py` | 解が一つに決まることの確認用 | 公開しない |
| `teacher/解説.md` | 正解・解法・授業でのつなげ方 | 公開しない |

正解は `public/` のどのファイルにも書いていません。正誤判定はスプレッドシート側で行うので、ページのソースを見ても答えはわかりません。GitHub には **`public/` の中身だけ** を push してください。

## セットアップ

1. **スプレッドシートを用意する**
   新しい Google スプレッドシートを作り、「拡張機能 → Apps Script」を開きます。`teacher/apps_script.gs` の内容をすべて貼り付けて保存します。
2. **ウェブアプリとしてデプロイする**
   「デプロイ → 新しいデプロイ → 種類：ウェブアプリ」を選び、次のように設定します。
   - 実行ユーザー：自分
   - アクセスできるユーザー：全員

   発行された URL（`https://script.google.com/macros/s/…/exec`）をコピーします。初回は権限の承認が求められます。
3. **URL を貼る**
   `public/index.html` の `CONFIG.ENDPOINT` と、`public/results.html` の `ENDPOINT` に、コピーした URL を貼ります。
4. **GitHub Pages で公開する**
   `public/` の中身をリポジトリのルートに置き、Settings → Pages で公開します。学生には `https://<ユーザー名>.github.io/<リポジトリ名>/` を配布します。
5. **動作確認をする**
   自分でテスト回答を1件送り、スプレッドシートの `responses` シートに行が増えることを確認します。確認後、テスト行は削除してください。

## 記録される列

`timestamp, task, student_id, answer, correct, confidence(1-5), rt_main_sec, step1, step1_correct, step2, step2_correct, reasoning, seen_before(yes/maybe/no), rt_total_sec, ua`

- `step1`：ミナトの1回目の発言の時点で、まだ候補に残ると思ったもの
- `step2`：ハルの発言の時点で、まだ候補に残ると思ったもの

これらは、推論が「どの段で崩れたか」を見るための項目です。
- 同じ学籍番号で複数回送信された場合も、すべて記録されます。集計ページでは最初の1件だけを数えます。

## 授業での流れ（例）

1. 回答の締切までに、`results.html` を **パラメータなし** で映します。回答の分布と平均の自信度だけが表示されます。
2. 解説のときは `results.html?ans=アイス・レモン` を開きます。正解の棒が色付きになり、Q1・Q3・Q4 の正答率が出ます。
3. 締切後に学生へ正解を見せたい場合は、`public/index.html` の `CONFIG.REVEAL_TEXT` に `"アイスのレモン味"` と書いて push します。

`apps_script.gs` を書き換えたときは、「デプロイを管理 → 編集 → 新バージョン」で再デプロイしないと反映されません。
