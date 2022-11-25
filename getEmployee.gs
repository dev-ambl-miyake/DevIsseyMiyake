/** 
 * 入社_メインアクション
 * 
 * スプレッドシート_社員番号入力を開いた際に実行されるトリガー関数
 * SmartHR_APIより取得した社員一覧データを履歴データ生成用関数へ渡す
*/
function getEmployee() {
  try{
    var work = "履歴データ作成";

    // 開始ログ
    log(work, 's');

    // 履歴データ[登録用]_スプレッドシートオブジェクトを取得
    let storeHistorySpreadsheets = SpreadsheetApp.openById(getProperties("storeHistorySpreadsheetsId")); // 履歴データ[登録用]_スプレッドシート
    let storeHistorySheet = storeHistorySpreadsheets.getSheets()[0]; // シート1を指定
    let storeHistoryLastUpdate = storeHistorySheet.getRange("H1").getValue(); // 前回スプレッドシートが更新された日時を取得

    // SmartHR_従業員一覧情報の取得
    let employeeList = callShrEmployeeListApi();

    // SmartHR_取得した従業員それぞれの家族一覧情報の取得
    if (employeeList.length > 0) {
      for(var el = 0; el < employeeList.length; el++) {
        // 家族更新フラグを追加
        employeeList[el]['family_update_flag'] = false;
        // 家族情報を取得
        const familyList = callShrFamilyApi(employeeList[el]['id']);

        if (familyList.length > 0) {
          for(var fl = 0; fl < familyList.length; fl++)  {
            // 履歴データ[登録用]の最終更新日時と家族情報の更新日時を比較、家族情報の更新日時が新しければフラグを立てる
            var familyUpdatedDate = new Date(familyList[fl]['updated_at']);
            if (familyUpdatedDate > storeHistoryLastUpdate ) {
              employeeList[el]['family_update_flag'] = true;
              break;
            }
          }
        }
      }
    }

    // 履歴データ[登録用]・履歴データ[更新用]スプレッドシートに履歴データを生成
    storeEmployeeHistory.storeHistory(employeeList);

    // 終了ログ
    log(work, 'e');
    SpreadsheetApp.getUi().alert("履歴データの作成が正常に完了しました。");
  }catch(e) {
    log(work + "[エラーログ]", "s");
    log(e.message, "error");
    log(work + "[エラーログ]", "e");
    SpreadsheetApp.getUi().alert("履歴データ作成中にエラーが発生しました。");
  }
}
