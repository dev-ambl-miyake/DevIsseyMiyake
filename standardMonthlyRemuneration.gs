// 標準報酬月額メイン処理
function standardMonthlyRemuneration() {

  try{
    var work = '標準報酬月額';
    // 開始ログ
    log('標準報酬月額', 's');

    // スクリプトプロパティの宣言（各スクリプトのプロジェクト設定でプロパティを設定する必要有）
    var folder_id = getProperties("obicCsvFolderId");
    var file_name = getProperties("obicCsvFileName"); // ※拡張子まで指定しないとfalseになる

    var operation_type = 4;

    // 1. OBIC_CSVファイル存在チェック
    log('1. OBIC_CSVファイル存在チェック', 's');
      // フォルダIDの取得とファイル名の取得
      var is_exist = checkExistFile(folder_id,file_name);

      // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
      if(is_exist == false){
        throw new Error("該当ファイルが見つかりませんでした。") 
      }
    log('1. OBIC_CSVファイル存在チェック', 'e');
    
    // 2. CSVファイルより対象データ取得
    log('2. CSVファイルより対象データ取得', 's');
      // 2-1 取得したCSVデータの取得（行ごとにデータ存在チェックをなくなるまで※開始位置は2行目）データ がない場合はファイル不備のアラート
      // 2-2 行データを配列に格納し、加工
      // csv取込
      // 取得したCSVの配列を加工する
      var processed_data = import_csv(operation_type);

      // 3. SmartHRへのデータ更新
      for (let i = 0; i < processed_data.length; i++) {
        callShrApi(processed_data[i],operation_type);
      } 
    log('2. CSVファイルより対象データ取得', 'e');
    // 成功メールを送信
    sendMail(work);
    // 終了ログ
    log('標準報酬月額', 'e');
  }catch(e){
    // メール本文に記載するエラー内容
    var error_message = 'エラー内容：'+e.message;
    // 失敗メールを送信
    sendMail(work,error_message);
    // 終了ログ
    log('標準報酬月額' + 'エラー内容：'+e.message, 'e');
  }
}
