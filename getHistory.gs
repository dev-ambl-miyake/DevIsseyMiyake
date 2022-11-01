/**
 * 履歴データ生成処理
 * @param {object} json  smartHR_APIで取得した従業員一覧情報jsonオブジェクト
 */
function storeHistory(json) {
  // 履歴データ[登録用]_スプレッドシートオブジェクトを取得
  let storeHistorySpreadsheets = SpreadsheetApp.openById(getProperties("storeHistorySpreadsheetsId")); // 履歴データ[登録用]_スプレッドシート
  let storeHistorySheet = storeHistorySpreadsheets.getSheets()[0]; // シート1を指定
  let storeHistoryLastUpdate = storeHistorySheet.getRange("H1").getValue(); // 前回スプレッドシートが更新された日時を取得
  let storeHistoryLastRow = storeHistorySheet.getLastRow(); // 値が存在(入力)している最終行を取得

  // 履歴データ[更新用]_スプレッドシートオブジェクトを取得
  let updateHistorySpreadsheets = SpreadsheetApp.openById(getProperties("updateHistorySpreadsheetsId")); //　履歴データ[更新用]_スプレッドシート
  let updateHistorySheet = updateHistorySpreadsheets.getSheets()[0]; // シート1を指定
  let updateHistoryLastUpdate = updateHistorySheet.getRange("H1").getValue(); // 前回スプレッドシートが更新された日時を取得

  // 更新対象社員選択_スプレッドシートオブジェクトを取得
  let updateEmployeeSpreadsheets = SpreadsheetApp.openById(getProperties("operationUpdateSpreadsheetsId")); //　更新対象社員選択_スプレッドシート
  let updateEmployeeSheet = updateEmployeeSpreadsheets.getSheets()[0]; // シート1を指定

  let date = new Date();  //現在の日時を取得
  let addHistoryData = [];  // 履歴データ格納用配列変数
  let addEmployeeData = [];  // 従業員データ格納用配列変数
  let updateStatus = false; // 更新対象社員選択・履歴データ[更新用]_更新判定用変数
  
  // ドキュメントロックを実施
  const lock = LockService.getDocumentLock();

  // 履歴データ[登録用]_スプレッドシートに存在する社員番号全件を取得
  const employeeNumber = storeHistorySheet.getRange(2,1,storeHistoryLastRow,1).getValues();
  
  if(lock.tryLock(1 * 1000)) {
    // 更新対象社員選択_スプレッドシートの範囲を指定
    let updateEmployeeSheetDataArea = updateEmployeeSheet.getRange(9,2,updateEmployeeSheet.getLastRow()-8,6);
    let sheetData = updateEmployeeSheetDataArea.getValues();

    // 更新対象社員選択_スプレッドシートの見出しの行番目を定義
    let headerLine = 8;

    // 現在日時を起点とした2か月前の日付値を定義
    let twoMonthAgo = new Date();
    twoMonthAgo.setMonth(twoMonthAgo.getMonth() - 2);
    let twoMonthsAgoDate = Utilities.formatDate(twoMonthAgo, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

    for(let sdl = 0; sdl < sheetData.length; sdl++) {
      var targetDate = new Date(sheetData[sdl][5]);
      var shrUpdatedDate = Utilities.formatDate(targetDate, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');

      // smartHR_更新日時と現在日時を比較し、2か月以上経過している行を削除
      if (shrUpdatedDate < twoMonthsAgoDate) {
        updateEmployeeSheet.deleteRow(headerLine + sdl + 1);
      }
    }
    
    // SmartHR_APIで取得した従業員人数分ループ
    for(var i = 0; i < json.length; i++) {

      // smartHRから取得した従業員情報の更新日時をセット
      let updatedDate = new Date(json[i].updated_at);
      
      // 前回の更新日より後に更新された従業員データのみ追記する
      if(storeHistoryLastUpdate < updatedDate) {
        // 履歴データ[登録用]_スプレッドシートに対象の社員番号が既に存在する場合
        if(employeeNumber.flat().includes(json[i].emp_code)) {
          // 履歴データ[更新用]_スプレッドシートに記載
          addHistoryData[i] = ["'" + json[i].emp_code, json[i].last_name + json[i].first_name, json[i].updated_at, json[i].id];
          updateHistorySheet.appendRow(addHistoryData[i]);

          // 更新対象社員選択_スプレッドシートに記載
          addEmployeeData[i] = ["", "", json[i].last_name + json[i].first_name, "'" + json[i].emp_code, "未", "未", json[i].updated_at];
          deleteSameEmployeeNumberRow(json[i].emp_code);
          updateEmployeeSheet.appendRow(addEmployeeData[i]);

          updateStatus = true;
        }
        // 履歴データ[登録用]_スプレッドシートに対象の社員番号が存在しない場合
        else{
          addHistoryData[i] = ["'" + json[i].emp_code, json[i].last_name, json[i].created_at, json[i].id];
          storeHistorySheet.appendRow(addHistoryData[i]);
        }
      }
    }

    // 履歴データ[登録用]_スプレッドシートのソート更新
    storeHistoryLastRow = storeHistorySheet.getLastRow();  // 履歴データ追記後の値が存在(入力)している最終行を取得
    let storeHistorySortData = storeHistorySheet.getRange(2,1,storeHistoryLastRow-1,4);
    storeHistorySortData.sort({column: 3, ascending: false}); // 作成日時でソート

    // 前回の更新日時をスプレッドシートに記載
    storeHistorySheet.getRange("F1").setValue(storeHistoryLastUpdate);
    // H1のセルにスプレッドシートを起動した時刻を記載（更新日時となる）
    storeHistorySheet.getRange("H1").setValue(date);

    if(updateStatus) {
      // 履歴データ[更新用]_スプレッドシートのソート更新
      let updateHistoryLastRow = updateHistorySheet.getLastRow();  // 値が存在(入力)している最終行を取得
      let updateHistorySortData = updateHistorySheet.getRange(2,1,updateHistoryLastRow-1,4);
      updateHistorySortData.sort({column: 3, ascending: false}); // 更新日時でソート

      // 前回の更新日時をスプレッドシートに記載
      updateHistorySheet.getRange("F1").setValue(updateHistoryLastUpdate);
      // H1のセルにスプレッドシートを起動した時刻を記載（更新日時となる）
      updateHistorySheet.getRange("H1").setValue(date);

      // 更新対象社員選択_スプレッドシートの更新
      let updateEmployeeLastRow = updateEmployeeSheet.getLastRow();  // 値が存在(入力)している最終行を取得
      let updateEmployeeSortData = updateEmployeeSheet.getRange(9,2,updateEmployeeLastRow-8,6);
      // updateEmployeeSortData.sort({column: 7, ascending: false}); // smartHR更新日時でソート
      updateEmployeeSheet.getRange(9,2,updateEmployeeLastRow-8).insertCheckboxes(); // チェックボックス作成
    }

    //ドキュメントロックを解除
    lock.releaseLock();
  }
}

/**
 * 履歴データ生成に伴う更新対象社員選択_スプレッドシートに社員情報を追記する際、
 * 追記対象の社員番号と同じデータ行が既に存在していた場合、
 * 既に存在している社員情報行を削除する
 * 
 * @param [array] json
 */
function deleteSameEmployeeNumberRow(json) {
  // 更新対象社員選択_スプレッドシート情報取得
  let ss = SpreadsheetApp.openById(getProperties("operationUpdateSpreadsheetsId"));
  let sheet = ss.getSheets()[0];
  let lastRow = sheet.getLastRow();  //最終行を取得
  let headerLine = 8;  //ヘッダーの行数

  // 更新対象社員選択シートに社員情報が存在していたら
  if(lastRow > headerLine) {
    //表示されている情報を取得
    let range = sheet.getRange(9,2,lastRow - headerLine,6);
    //値を取得
    let values = range.getValues();

    //取得した値の中に同じ社員番号が存在するか
    for(let i = 0; i < values.length; i++) {
      //同値の社員番号が存在したらその行を削除
      if(values[i].flat().includes(json)) {
        sheet.deleteRow(headerLine + i + 1);
        break;
      }
    }
  } 
}
