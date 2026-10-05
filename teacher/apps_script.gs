/**
 * 「先生のおやつはどれ？」回答記録用 Google Apps Script
 * スプレッドシートの「拡張機能 > Apps Script」に貼り付けて、ウェブアプリとしてデプロイする。
 * 正誤判定はここで行う（ページ側には正解を置かない）。
 */

const SHEET_NAME = "responses";

const ANSWER = "アイス・レモン";
const STEP1 = ["アイス・ソーダ", "アイス・レモン", "チョコ・ソーダ", "チョコ・抹茶", "チョコ・キャラメル"];
const STEP2 = ["アイス・レモン", "チョコ・抹茶", "チョコ・キャラメル"];

const HEADERS = [
  "timestamp", "task", "student_id",
  "answer", "correct", "confidence", "rt_main_sec",
  "step1", "step1_correct", "step2", "step2_correct",
  "reasoning", "seen_before", "rt_total_sec", "ua",
];

function sameSet_(str, target) {
  const a = String(str || "").split(" / ").filter(Boolean);
  return a.length === target.length && a.every(x => target.indexOf(x) >= 0) ? 1 : 0;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    d.timestamp = new Date();
    d.correct = d.answer === ANSWER ? 1 : 0;
    d.step1_correct = sameSet_(d.step1, STEP1);
    d.step2_correct = sameSet_(d.step2, STEP2);
    sheet_().appendRow(HEADERS.map(h => (d[h] === undefined ? "" : d[h])));
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

/** 授業中の集計表示用（results.html から読む）。個人情報は返さない。 */
function doGet() {
  const rows = sheet_().getDataRange().getValues();
  const h = rows.shift() || [];
  const col = name => h.indexOf(name);
  // 同じ学籍番号の複数回答は最初の1件だけ数える
  const seen = {};
  const data = rows.filter(r => {
    const id = r[col("student_id")];
    if (seen[id]) return false;
    seen[id] = true;
    return true;
  });
  const answers = {};
  let c = 0, s1 = 0, s2 = 0, conf = 0;
  data.forEach(r => {
    const a = r[col("answer")];
    answers[a] = (answers[a] || 0) + 1;
    c += Number(r[col("correct")]) || 0;
    s1 += Number(r[col("step1_correct")]) || 0;
    s2 += Number(r[col("step2_correct")]) || 0;
    conf += Number(r[col("confidence")]) || 0;
  });
  const n = data.length;
  const out = {
    n: n,
    answers: answers,
    correct_rate: n ? c / n : 0,
    step1_rate: n ? s1 / n : 0,
    step2_rate: n ? s2 / n : 0,
    mean_confidence: n ? conf / n : 0,
  };
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
