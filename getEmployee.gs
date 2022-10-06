function getEmployee(idList) {
  //エラー発生時の例外処理
  try{
    // 開始ログ
    commonFunction.log('smartHRから情報取得', 's');
    const AccessToken = 'R4CrXND4R4xkpcv6WMPQJNxzg7ke4YhP'  //smartHRのアクセストークン
    const SubDomain = 'a6207dec84a2577ef2a94ee1'  //smartHRのサブドメイン

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

    //idList総数繰り返し取得
    for(let i = 0; i < idList.length; i++) {

      //従業員リスト取得APIにリクエストを送信
      const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[i] , params)

      //レスポンスを文字列で取得
      const responseBody = response.getContentText()

      //jsonオブジェクトに変換
      json.push(JSON.parse(responseBody))

    }

    // 終了ログ
    commonFunction.log('smartHRから情報取得', 'e');

    return json
  }catch(e) {
    SpreadsheetApp.getUi().alert("smartHRから情報取得中にエラーが発生しました。");
  }
}

function getFamiliy(idList) {
  //エラー発生時の例外処理
  try{
    // 開始ログ
    commonFunction.log('smartHRから情報取得', 's');
    const AccessToken = 'R4CrXND4R4xkpcv6WMPQJNxzg7ke4YhP'  //smartHRのアクセストークン
    const SubDomain = 'a6207dec84a2577ef2a94ee1'  //smartHRのサブドメイン

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

    //idList総数繰り返し取得
    for(let i = 0; i < idList.length; i++) {

      //従業員リスト取得APIにリクエストを送信
      const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[i] + '/dependents' , params)

      //レスポンスを文字列で取得
      const responseBody = response.getContentText()

      //jsonオブジェクトに変換
      json.push(JSON.parse(responseBody))

    }

    // 終了ログ
    commonFunction.log('smartHRから情報取得', 'e');

    return json
  }catch(e) {
    SpreadsheetApp.getUi().alert("smartHRから情報取得中にエラーが発生しました。");
  }
}

function createHistory() {
  //スプレットシート起動時に履歴データの更新を行う
  storeEmployee.getEmployee();
}