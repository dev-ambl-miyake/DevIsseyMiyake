// 年調変動入力メイン処理
function yearEndAdjustment() {

  try{
    // 開始ログ
    log('年調・変動入力', 's');

    // 業種の宣言
    var operation_type = 6;
    var work = '年調・変動入力';

    // スクリプトプロパティの宣言（各スクリプトのプロジェクト設定でプロパティを設定する必要有）
    var folder_id = getProperties("shrCsvFolderId");
    var file_name = getProperties("shrCsvFileName"); // ※拡張子まで指定しないとfalseになる
    console.log(folder_id,file_name);

    // 1. SmartHR APIにて源泉徴収票データを取得
    log('1. SmartHR APIにて源泉徴収票データを取得', 's');
      // スプレッドシートに入力された従業員番号取得
      // var emp_codes = getValues();

      // 空配列宣言
      // var staff_data_list = {};
      
      // 取得API呼び出し
      // for (let i = 0; i < emp_codes.length; i++) {
      //   var staff_data = callShrApi(emp_codes[i],operation_type);
      //   console.log(staff_data);
      //   var staff_data_list = staff_data.push()
      //   console.log(staff_data_list);
      // }
      // return 従業員番号が一致するjson

      // CSV読み込み＆加工
      // 1-1指定のドライブファイル内にファイルがあるか確認
      // フォルダIDの取得とファイル名の取得
      var is_exist = checkExistFile(folder_id,file_name);

      // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
        if(is_exist == false){
          var no_file_message = '該当ファイルがありませんでした。';
          alert(no_file_message);
          
          // 終了ログ
          log('年調・変動入力', 'e');
          return;
        }

    // 2-1 取得したCSVデータの取得（行ごとにデータ存在チェックをなくなるまで※開始位置は2行目）データ がない場合はファイル不備のアラート
    // 2-2 行データを配列に格納し、加工
      // csv取込
      // 取得したCSVの配列を加工する
      var processed_data = import_csv();

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
    console.log(e);
    // メール本文に記載するエラー内容
    var error_message = 'エラー内容：'+e.message;
    // 失敗メールを送信
    sendMail(work,error_message);
    // 終了ログ
    log('年調・変動入力', 'e');
  }
}