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

    // SmartHR 全従業員一覧情報の取得
    const json = callShrEmployeeListApi();

    // 履歴データ[登録用]・履歴データ[更新用]スプレッドシートに履歴データを生成
    storeEmployeeHistory.storeHistory(json);

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
