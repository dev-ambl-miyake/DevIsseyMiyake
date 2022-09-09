// 源泉徴収票データCSVの存在チェック
function taxWithholding() {
  // 1-1指定のドライブファイル内にファイルがあるか確認

  // フォルダIDの取得とファイル名の取得
  var folder_id = '1Plhj8HpJIrSVosMUI16CJz-AOPc52Ki3';
  var file_name = 'OBIC_源泉徴収票_サンプル.csv'; // ※拡張子まで指定しないとfalseになる
  var is_exist = checkExistFile(folder_id,file_name);

  // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
  if(is_exist = false){
    alert(folder_id,file_name);
  }

  // 2-1 取得したCSVデータの取得（行ごとにデータ存在チェックをなくなるまで※開始位置は2行目）データがない場合はファイル不備のアラート

  // 2-2 行データを配列に格納し、加工

  // 3-1 SHRへのデータ連携更新(SHR取り込み形式のCSVファイルとして出力)

  // 3-2 指定のドライブファイルへ保存
  

}
