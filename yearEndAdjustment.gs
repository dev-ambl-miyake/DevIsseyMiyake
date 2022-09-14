// 年調変動入力メイン処理
function yearEndAdjustment() {

  try{
    var work = '年調・変動入力';
    // 開始ログ
    log('年調・変動入力', 's');

    // スクリプトプロパティの宣言（各スクリプトのプロジェクト設定でプロパティを設定する必要有）
    var folder_id = getProperties("obicCsvFolderId");
    var file_name = getProperties("obicCsvFileName"); // ※拡張子まで指定しないとfalseになる

    var operation_type = 6;

    // 1. SmartHR APIにて源泉徴収票データを取得
    log('1. SmartHR APIにて源泉徴収票データを取得', 's');
      // スプレッドシートに入力された従業員番号取得

      // 取得API呼び出し
      // return 従業員番号が一致するjson

    log('1. SmartHR APIにて源泉徴収票データを取得', 'e');
    
    // 2. CSVファイルより対象データ取得
    log('2. 取得データの加工', 's');

      // OBICの項目に合うように並び替え、加工
  
    log('2. 取得データの加工', 'e');

    log('3. OBICへのデータ連携', 's');

      // 所定ファイルへ出力

    log('3. OBICへのデータ連携', 'e');

    // 終了ログ
    log('年調・変動入力', 'e');
  }catch(e){
    // メール本文に記載するエラー内容
    var error_message = 'エラー内容：'+e.message;
    // 失敗メールを送信
    sendMail(work,error_message);
    // 終了ログ
    log('年調・変動入力', 'e');
  }
}