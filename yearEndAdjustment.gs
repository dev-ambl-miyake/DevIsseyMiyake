// 年調変動入力メイン処理
function yearEndAdjustment() {

  try{
    var work = '年調変動入力';
    // 開始ログ
    log('年調変動入力', 's');

    // スクリプトプロパティの宣言（各スクリプトのプロジェクト設定でプロパティを設定する必要有）
    var folder_id = getProperties("shrCsvFolderId");
    var file_name = getProperties("shrCsvFileName"); // ※拡張子まで指定しないとfalseになる

    var operation_type = 6;

    // 1. SHR_CSVファイル存在チェック
    log('1. SHR_CSVファイル存在チェック', 's');
      // フォルダIDの取得とファイル名の取得
      var is_exist = checkExistFile(folder_id,file_name);

      // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
      if(is_exist == false){
        var no_file_message = '該当ファイルがありませんでした。';
        alert(no_file_message);
        
        // 終了ログ
        log('年調変動入力', 'e');
        return;
      }
    log('1. SHR_CSVファイル存在チェック', 'e');
    
    // 2. CSVファイルより対象データ取得
    log('2. CSVファイルより対象データ取得して加工し出力', 's');
      // 2-1 取得したCSVデータの取得（行ごとにデータ存在チェックをなくなるまで※開始位置は2行目）データ がない場合はファイル不備のアラート
      // 2-2 行データを配列に格納し、加工
      // csv取込
      // 取得したCSVの配列を加工する
      var processed_data = import_csv(operation_type);

      // 3. OBIC受入用CSVを指定フォルダに出力
      export_csv(processed_data,operation_type);
    log('2. CSVファイルより対象データ取得して加工し出力', 'e');
    // 成功メールを送信
    sendMail(work);
    // 終了ログ
    log('年調変動入力', 'e');
  }catch(e){
    console.log(e);
    // メール本文に記載するエラー内容
    var error_message = 'エラー内容：'+e.message;
    // 失敗メールを送信
    sendMail(work,error_message);
    // 終了ログ
    log('年調変動入力', 'e');
  }
}
