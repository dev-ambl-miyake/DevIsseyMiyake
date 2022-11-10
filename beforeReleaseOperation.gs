/**
 * 連携登録システムリリース前に実施するファンクション
 * 
 * SmartHRに登録されている全社員情報を、
 * [登録用]履歴データ_スプレッドシートへ記載する
 * 
 */
function storeEmployeeHistory() {
  /* smartHRから社員情報を全件取得する */
  // SmartHR_API 環境値
  const AccessToken = getProperties("ACCESS_TOKEN");  //smartHRのアクセストークン
  const SubDomain = getProperties("SUB_DOMAIN");  //smartHRのサブドメイン

  // HTTPリクエストヘッダーの作成
  const headers = {
    //アクセストークンの設定
    'Authorization': 'Bearer ' + AccessToken
  }

  // HTTPリクエストのオプションの設定
  const params = {
    'method': 'GET',  //GETメソッドでリクエスト
    'headers' : headers  //HTTPリクエストヘッダー
  }

  // 1ページ単位(枠)の中で取得する社員件数
  const getCount = 3;

  const firstResponse = UrlFetchApp.fetch('https://' + SubDomain + '.daruma.space/api/v1/crews?sort=-emp_code&page=1&per_page=' + getCount, params);

  const headerResponse = firstResponse.getHeaders();

  // 社員数を取得
  const employeeCount = headerResponse['x-total-count'];

  if (employeeCount % getCount == 0) {
    var pageCount = Math.floor(employeeCount / getCount);
  } else {
    var pageCount = Math.floor(employeeCount / getCount) + 1;
  }
  // console.log(pageCount);

  var employeeList = [];

  // SmartHR_API 従業員_"リストの取得"にリクエストを送信しレスポンスを取得
  for (var page = 1; page <= pageCount; page++) {
    const resultResponse = UrlFetchApp.fetch('https://' + SubDomain + '.daruma.space/api/v1/crews?sort=-emp_code&page=' + page + '&per_page=' + getCount, params);

    // レスポンスを文字列で取得
    const resultResponseBody = resultResponse.getContentText();
    // jsonオブジェクトに変換
    const json = JSON.parse(resultResponseBody);

    if (json.length > 0) {
      for (var loopCount = 0; loopCount < json.length; loopCount++) {
        employeeList.push(json[loopCount]);
      }
    }
  }


  /* 履歴データ[登録用]_スプレッドシートに社員情報を記載 */
  let storeHistorySpreadsheets = SpreadsheetApp.openById("1Cux-sAZdGWXGKtR5FQucptmnS3yAYAjrPeSfB0tYDsU");
  let storeHistorySheet = storeHistorySpreadsheets.getSheets()[0];
  let date = new Date();
  let addHistoryData = [];

  for(var employeeLoopCount = 0; employeeLoopCount < employeeList.length; employeeLoopCount++) {
    addHistoryData[employeeLoopCount] = ["'" + employeeList[employeeLoopCount].emp_code, employeeList[employeeLoopCount].last_name + employeeList[employeeLoopCount].first_name, employeeList[employeeLoopCount].created_at, employeeList[employeeLoopCount].id];
    storeHistorySheet.appendRow(addHistoryData[employeeLoopCount]);
  }
  storeHistorySheet.getRange("H1").setValue(date);
}
