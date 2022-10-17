/** 
 * 入社_メインアクション
 * 
 * スプレッドシート_社員番号入力を開いた際に実行されるトリガー関数
 * SmartHR_APIより取得した社員一覧データを履歴データ生成用関数へ渡す
*/
function getEmployee() {
  try{
    // 開始ログ
    log('履歴データ作成', 's');

    // SmartHR_API 環境値
    const AccessToken = getProperties("ACCESS_TOKEN")  //smartHRのアクセストークン
    const SubDomain = getProperties("SUB_DOMAIN")  //smartHRのサブドメイン

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

    // SmartHR_API 従業員_"リストの取得"にリクエストを送信しレスポンスを取得
    const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews?per_page=100', params)

    // レスポンスを文字列で取得
    const responseBody = response.getContentText()

    // jsonオブジェクトに変換
    const json = JSON.parse(responseBody)

    // 履歴データ[登録用]・履歴データ[更新用]スプレッドシートに履歴データを生成
    storeEmployeeHistory.storeHistory(json);

    // 終了ログ
    log('履歴データ作成', 'e');
  }catch(e) {
    SpreadsheetApp.getUi().alert("履歴データ作成中にエラーが発生しました。");
  }
}
