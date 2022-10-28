/**
 * 履歴データ生成処理
 * @param {object} json  smartHR_APIで取得した従業員一覧情報jsonオブジェクト
 */
function storeHistory(json) {
  // 履歴データ[登録用]_スプレッドシートオブジェクトを取得
  let storeHistorySpreadsheets = SpreadsheetApp.openById(getProperties("storeHistorySpreadsheetsId")); // 履歴データ[登録用]_スプレッドシート
  let storeHistorySheet = storeHistorySpreadsheets.getSheets()[0]; // シート1を指定
  let storeHistoryLastUpdate = storeHistorySheet.getRange("H1").getValue(); //前回の更新日時を取得
  let storeHistoryLastRow = storeHistorySheet.getLastRow(); // 値が存在(入力)している最終行を取得

  // 履歴データ[更新用]_スプレッドシートオブジェクトを取得
  let updateHistorySpreadsheets = SpreadsheetApp.openById(getProperties("updateHistorySpreadsheetsId")); //　履歴データ[更新用]_スプレッドシート
  let updateHistorySheet = updateHistorySpreadsheets.getSheets()[0]; // シート1を指定
  let updateHistoryLastUpdate = updateHistorySheet.getRange("H1").getValue(); //前回の更新日時を取得

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
          updateEmployee.create(json[i].emp_code);
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
    let storeHistorySortData = storeHistorySheet.getRange(2,1,storeHistoryLastRow-1,3);
    storeHistorySortData.sort({column: 3, ascending: false}); // 作成日時でソート

    // 前回の更新日時をスプレッドシートに記載
    storeHistorySheet.getRange("F1").setValue(storeHistoryLastUpdate);
    // H1のセルにスプレッドシートを起動した時刻を記載（更新日時となる）
    storeHistorySheet.getRange("H1").setValue(date);

    if(updateStatus) {
      // 履歴データ[更新用]_スプレッドシートのソート更新
      let updateHistoryLastRow = updateHistorySheet.getLastRow();  // 値が存在(入力)している最終行を取得
      let updateHistorySortData = updateHistorySheet.getRange(2,1,updateHistoryLastRow-1,3);
      updateHistorySortData.sort({column: 3, ascending: false}); // 更新日時でソート

      // 前回の更新日時をスプレッドシートに記載
      updateHistorySheet.getRange("F1").setValue(updateHistoryLastUpdate);
      // H1のセルにスプレッドシートを起動した時刻を記載（更新日時となる）
      updateHistorySheet.getRange("H1").setValue(date);

      // 更新対象社員選択_スプレッドシートの更新
      let updateEmployeeLastRow = updateEmployeeSheet.getLastRow();  // 値が存在(入力)している最終行を取得
      let updateEmployeeSortData = updateEmployeeSheet.getRange(9,2,updateEmployeeLastRow-8,6);
      updateEmployeeSortData.sort({column: 7, ascending: false}); // smartHR更新日時でソート
      updateEmployeeSheet.getRange(9,2,updateEmployeeLastRow-8).insertCheckboxes(); // チェックボックス作成
    }

    //ドキュメントロックを解除
    lock.releaseLock();
  }
}
