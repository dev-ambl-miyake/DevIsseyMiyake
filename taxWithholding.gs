const processName = '源泉徴収票';

// 源泉徴収票データCSVの存在チェック
function taxWithholding() {

  // 開始ログ

  // log(processName, 's');

  // 1-1指定のドライブファイル内にファイルがあるか確認
  // フォルダIDの取得とファイル名の取得
  var folder_id = '1Plhj8HpJIrSVosMUI16CJz-AOPc52Ki3';
  var file_name = 'OBIC_源泉徴収票_サンプル.'; // ※拡張子まで指定しないとfalseになる
  var is_exist = checkExistFile(folder_id,file_name);

  // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
  if(is_exist == false){
    var message = '該当ファイルがありませんでした。';
    alert(message);
    // ログ出力をして処理を終了
    // log(processName, 'e');
    return;
  }

  // 2-1 取得したCSVデータの取得（行ごとにデータ存在チェックをなくなるまで※開始位置は2行目）データ がない場合はファイル不備のアラート

  // 2-2 行データを配列に格納し、加工

  // 3-1 SHRへのデータ連携更新(SHR取り込み形式のCSVファイルとして出力)

  // 3-2 指定のドライブファイルへ保存
  

}
