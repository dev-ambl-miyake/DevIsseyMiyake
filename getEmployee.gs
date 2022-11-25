/** 
 * 変更申請_メインアクション
 * 
 * スプレッドシート_更新対象社員選択を開いた際に実行されるトリガー関数
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

function getEmployeeList(idList) {
  //エラー発生時の例外処理
  try{
    var work = "SmartHR_API 社員情報取得";

    // 開始ログ
    log(work, 's');

    // SmartHR_API 環境値
    const AccessToken = getProperties("ACCESS_TOKEN");  //smartHRのアクセストークン
    const SubDomain = getProperties("SUB_DOMAIN");  //smartHRのサブドメイン

    //HTTPリクエストヘッダーの作成
    const headers = {
      //アクセストークンの設定
      'Authorization': 'Bearer ' + AccessToken
    }

    //HTTPリクエストのオプションの設定
    const params = {
      'method': 'GET',  //GETメソッドでリクエスト
      'headers' : headers  //HTTPリクエストヘッダー
    }

    let json = [];

    // 更新対象社員の人数分ループ
    for(let i = 0; i < idList.length; i++) {

      //従業員リスト取得APIにリクエストを送信
      const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[i] , params)

      //レスポンスを文字列で取得
      const responseBody = response.getContentText()

      //jsonオブジェクトに変換
      json.push(JSON.parse(responseBody))

    }

    // 終了ログ
    log(work, 'e');

    return json;
  } catch(e) {
    log(work + "[エラーログ]", "s");
    log(e.message, "error");
    log(work + "[エラーログ]", "e");
    SpreadsheetApp.getUi().alert("smartHRから情報取得中にエラーが発生しました。");
  }
}

/**
 * 更新対象社員選択_スプレッドシート上でチェックのついている社員情報行を配列で取得する
 * 
 * @return [array] selectedRowList
 */
function getSelectedRow() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let lastRow = sheet.getLastRow();  //最終行を取得
  let headerLine = 8;  //ヘッダーの行数

  // スプレッドシート上に存在する社員情報を範囲指定
  let range = sheet.getRange(9,2,lastRow - headerLine,6);
  // 範囲指定された行数分のセルデータを配列として取得
  let values = range.getValues();

  let selectedRowList = [];

  //取得した値の中で、checkboxにチェックが付いているもののみ取得
  for(let i = 0; i < values.length; i++) {
    if(values[i][0]) {
      selectedRowList.push(values[i]);
    }
  }

  return selectedRowList;
}


/**
 * SmartHR_APIで取得した社員情報全件の中に、
 * 更新対象社員選択_スプレッドシート上で選択された社員情報が存在するか照合する
 * 
 * @param [array] selectedEmployeeList
 * 
 * @return [array] employeeIdList
 */
function checkEmployeeCode(selectedEmployeeList) {
  // 社員情報全件取得
  const employeeList = callShrEmployeeListApi();

  let employeeIdList = [];

  for(var sel = 0; sel < selectedEmployeeList.length; sel++) {
    for(var el = 0; el < employeeList.length; el++) {
      if (employeeList[el]['emp_code'] == selectedEmployeeList[sel][2]) {
        employeeIdList.push(employeeList[el]['id']);
        break;
      }
    }
  }

  // 選択された社員件数と照合一致した社員件数が同じであれば返却
  if (selectedEmployeeList.length == employeeIdList.length) {
    return employeeIdList;
  } else {
    throw new Error("選択された社員の中に、SmartHRに登録されていない社員情報(社員番号)が存在します。");
  }
}

/**
 * チェックがついている社員情報行の連携ステータスを更新する
 * 
 * @param [number] serviceType
 * 
 */
function changeStatus(serviceType) {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let lastRow = sheet.getLastRow();  //最終行を取得
  let headerLine = 8;  //ヘッダーの行数

  //表示されている情報を取得
  let range = sheet.getRange(9,2,lastRow - headerLine,6);
  //値を取得
  let values = range.getValues();

  //取得した値の中で、checkboxにチェックが付いているもののみ取得
  for(let i = 0; i < values.length; i++) {
    if(values[i][0]) {
      //　カオナビ更新の場合
      if(serviceType === 1) {
        sheet.getRange(headerLine + i + 1, 5).setValue("済");
      }
      //OBIC更新の場合
      else {
        sheet.getRange(headerLine + i + 1, 6).setValue("済");
      }
    }
  }
}