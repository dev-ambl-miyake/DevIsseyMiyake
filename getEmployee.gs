function getEmployee() {
  //エラー発生時の例外処理
  try{
    // 開始ログ
    commonFunction.log('履歴データ作成', 's');
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

    //従業員リスト取得APIにリクエストを送信
    const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews?per_page=100', params)

    //レスポンスを文字列で取得
    const responseBody = response.getContentText()

    //jsonオブジェクトに変換
    const json = JSON.parse(responseBody)

    //スプレッドシートに履歴データを作成
    storeEmployeeHistory.storeHistory(json);

    // 終了ログ
    commonFunction.log('履歴データ作成', 'e');
  }catch(e) {
    SpreadsheetApp.getUi().alert("履歴データ作成中にエラーが発生しました。");
  }
}
