// 源泉徴収票データ取込処理
function taxWithholding() {

  // 開始ログ
  log('源泉徴収票', 's');

  // スクリプトプロパティの宣言（各スクリプトのプロジェクト設定でプロパティを設定する必要有）
  var folder_id = getProperties("obicCsvFolderId");
  var file_name = getProperties("obicCsvFileName"); // ※拡張子まで指定しないとfalseになる

  var operation_type = 5;


  // 1-1指定のドライブファイル内にファイルがあるか確認
    // フォルダIDの取得とファイル名の取得
    var is_exist = checkExistFile(folder_id,file_name);

  // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
    if(is_exist == false){
      var no_file_message = '該当ファイルがありませんでした。';
      alert(no_file_message);
      
      // 終了ログ
      log('源泉徴収票', 'e');
      return;
    }

  // 2-1 取得したCSVデータの取得（行ごとにデータ存在チェックをなくなるまで※開始位置は2行目）データ がない場合はファイル不備のアラート
  // 2-2 行データを配列に格納し、加工
    // csv取込
    // 取得したCSVの配列を加工する
    var processed_data = import_csv(operation_type);

  // 3-1 SHRへのデータ連携更新(SHR取り込み形式のCSVファイルとして出力)
  // 3-2 指定のドライブファイルへ保存
  var processed_data = export_csv(processed_data,operation_type);
  
  // 終了ログ
  log('源泉徴収票', 'e');

}
