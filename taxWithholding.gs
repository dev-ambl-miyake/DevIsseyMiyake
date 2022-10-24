// 源泉徴収票データ取込メイン処理
function taxWithholding() {

  try{
    // 開始ログ
    log('源泉徴収票', 's');

    // スクリプトプロパティの宣言（各スクリプトのプロジェクト設定でプロパティを設定する必要有）
    var folder_id = getProperties("obicCsvFolderId");
    var file_name = getProperties("obicCsvFileName"); // ※拡張子まで指定しないとfalseになる

    var operation_type = 5;


    // 1-1指定のドライブファイル内にファイルがあるか確認
    // フォルダIDの取得とファイル名の取得
    log('1. OBIC_CSVファイル存在チェック', 's');
    var is_exist = checkExistFile(folder_id,file_name);

    // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
    if(is_exist == false){
      var no_file_message = '該当ファイルがありませんでした。';
      alert(no_file_message);
      
      throw new Error("該当ファイルがありませんでした。");
    }
    log('1. OBIC_CSVファイル存在チェック', 'e');

    // 2-1 取得したCSVデータの取得（行ごとにデータ存在チェックをなくなるまで※開始位置は2行目）データ がない場合はファイル不備のアラート
    log('2. 取得したCSVデータの取得,CSV配列の加工', 's');
    // 2-2 行データを配列に格納し、加工
    // csv取込
    // 取得したCSVの配列を加工する
    var processed_data = import_csv(operation_type);
    log('2. 取得したCSVデータの取得,CSV配列の加工', 'e');

    // 3-1 SHRへのデータ連携更新(SHR取り込み形式のCSVファイルとして出力)
    // 3-2 指定のドライブファイルへ保存
    log('3. SHRへのデータ連携API呼出,データ更新', 's');
    var processed_data = export_csv(processed_data,operation_type);
    log('3. SHRへのデータ連携API呼出,データ更新', 'e');
    
    // 終了ログ
    log('源泉徴収票', 'e');
  }catch(e){
    // ログファイルにに記載するエラー内容
    var error_message = 'エラー内容：'+e.message;
    // 終了ログ
    log('源泉徴収票異常終了'+ error_message, 'e');
  }

}
