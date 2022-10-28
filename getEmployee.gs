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

// function getFamiliy(idList) {
//   //エラー発生時の例外処理
//   try{
//     // 開始ログ
//     commonFunction.log('smartHRから情報取得', 's');
//     const AccessToken = 'R4CrXND4R4xkpcv6WMPQJNxzg7ke4YhP'  //smartHRのアクセストークン
//     const SubDomain = 'a6207dec84a2577ef2a94ee1'  //smartHRのサブドメイン

//     //HTTPリクエストヘッダーの作成
//     const headers = {
//       //アクセストークンの設定
//       'Authorization': 'Bearer ' + AccessToken
//     }

//     //HTTPリクエストのオプションの設定
//     const params = {
//       'method': 'GET',  //GETメソッドでリクエスト
//       'headers' : headers  //HTTPリクエストヘッダー
//     }

//     let json = [];

//     //idList総数繰り返し取得
//     for(let i = 0; i < idList.length; i++) {

//       //従業員リスト取得APIにリクエストを送信
//       const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[i] + '/dependents' , params)

//       //レスポンスを文字列で取得
//       const responseBody = response.getContentText()

//       //jsonオブジェクトに変換
//       json.push(JSON.parse(responseBody))

//     }

//     // 終了ログ
//     commonFunction.log('smartHRから情報取得', 'e');

//     return json
//   }catch(e) {
//     SpreadsheetApp.getUi().alert("smartHRから情報取得中にエラーが発生しました。");
//   }
// }

// function createHistory() {
//   // スプレットシート起動時に履歴データの更新を行う
//   storeEmployee.getEmployee();
// }

function getCheckValue() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let lastRow = sheet.getLastRow();  //最終行を取得
  let headerLine = 8;  //ヘッダーの行数

  //表示されている情報を取得
  let range = sheet.getRange(9,2,lastRow - headerLine,6);
  //値を取得
  let values = range.getValues();

  let checkValue = [];

  //取得した値の中で、checkboxにチェックが付いているもののみ取得
  for(let i = 0; i < values.length; i++) {
    if(values[i][0]) {
      checkValue.push(values[i]);
    }
  }

  return checkValue
}

function getSmarthrId(checkValue) {
  // 履歴データ[登録用]_スプレッドシート情報取得
  let ss = SpreadsheetApp.openById(getProperties("storeHistorySpreadsheetsId"));
  let sheet = ss.getSheets()[0];
  let lastRow = sheet.getLastRow();
  const range = sheet.getRange(2,1,lastRow, 4).getValues();  //履歴データ新規からデータを取得

  let idList = [];

  for(let i = 0; i < checkValue.length; i++) {
    for(let j = 0; j < range.length; j++) {
      if(range[j].includes(checkValue[i][2])) {
        idList.push(range[j][3])  //idのみ
      }
    }
  }
  return idList
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