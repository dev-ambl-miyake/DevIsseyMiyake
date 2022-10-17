function proclamationShrMain() {
  try{
    var work = '発令(SmartHR更新)';
    // 開始ログ
    log('発令', 's');
    // スクリプトプロパティの宣言（各スクリプトのプロジェクト設定でプロパティを設定する必要有）
    // OBICのCSVフォルダーID
    var folder_id = getProperties("obicCsvFolderId");

    // OBICのCSVファイル名
    var gensyokuHonmuCsv = getProperties("gensyokuHonmuCsv"); // 現職本務.csv
    var gensyokuKenmuCsv = getProperties("gensyokuKenmuCsv"); // 現職兼務.csv
    var hatsureiRirekiKenmuCsv = getProperties("hatsureiRirekiKenmuCsv"); // 発令履歴兼務.csv
    var honmuKeirekiCsv = getProperties("honmuKeirekiCsv"); // 本務経歴.csv
    var tsukinTeateCsv = getProperties("tsukinTeateCsv"); // 通勤手当（公共）.csv

    // 1. OBIC出力の発令データCSVファイル存在チェック
    // 対象ファイルが存在する場合のみ実行(対象5ファイルの全てが揃ってないといけない)
    log('1. OBIC_CSVファイル存在チェック', 's');
    var is_gensyokuHonmuCsv = checkExistFile(folder_id,gensyokuHonmuCsv); // 現職本務.csv
    var is_gensyokuKenmuCsv = checkExistFile(folder_id,gensyokuKenmuCsv); // 現職兼務.csv
    var is_hatsureiRirekiKenmuCsv = checkExistFile(folder_id,hatsureiRirekiKenmuCsv); // 発令履歴兼務.csv
    var is_honmuKeirekiCsv = checkExistFile(folder_id,honmuKeirekiCsv); // 本務経歴.csv
    var is_tsukinTeateCsv = checkExistFile(folder_id,tsukinTeateCsv); // 通勤手当（公共）.csv

    // 1-2 存在しない場合スプレッドシート上に「ファイル無し」のアラートメッセージを表示
    if(is_gensyokuHonmuCsv == false || is_gensyokuKenmuCsv == false || is_hatsureiRirekiKenmuCsv == false || is_honmuKeirekiCsv == false || is_tsukinTeateCsv == false)
    {
      throw new Error("該当ファイルが見つかりませんでした。");
    }
    log('1. OBIC_CSVファイル存在チェック', 's');

    // CSVファイルを取得
    log('2. CSVファイルより対象データ取得', 's');
    let csv_announcement = import_csv(operation_type = 3.1)
    let csv_travel_allowance = import_csv(operation_type = 3.2)
    let csv_sub_business = import_csv(operation_type = 3.3)
    let csv_proclamation_history = import_csv(operation_type = 3.4)
    let csv_main_hstory = import_csv(operation_type = 3.5)

    let smartHR_data = changeDataToSHR(csv_announcement, operation_type = 3.1);
    let smartHR_tsukin_data = changeDataToSHR(csv_travel_allowance, operation_type = 3.2);
    log('2. CSVファイルより対象データ取得', 'e');

    // 3. SmartHRへのデータ更新’（現職本務）
    log('3. SmartHRへのデータ更新’（現職本務）', 's');
    for (let i = 0; i < smartHR_data.length; i++) {
      callShrApi(smartHR_data[i],operation_type = 3.1);
    } 
    log('3. SmartHRへのデータ更新’（現職本務）', 'e');

    // 3. SmartHRへのデータ更新（通勤手当）
    log('3. SmartHRへのデータ更新（通勤手当）', 's');
    for (let i = 0; i < smartHR_data.length; i++) {
      callShrApi(smartHR_tsukin_data[i],operation_type = 3.2);
    } 
    log('3. SmartHRへのデータ更新（通勤手当）', 'e');

    // 成功メールを送信
    sendMail(work);
  }catch(e){
    // メール本文に記載するエラー内容
    var error_message = 'エラー内容：'+e.message;
    // 失敗メールを送信
    sendMail(work,error_message);
    // 終了ログ
    log('発令' + 'エラー内容：'+e.message, 'e');
  }
}

function changeDataToSHR(csv_data,operation_type) {

  if(operation_type == 3.1){
    // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][0] = '0'+ csv_data[i][0];
    }
  }else if(operation_type == 3.2){
    csv_data.shift();
    // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][1] = '0'+ csv_data[i][1];
    }

    // 「、」「。」「・」で分割する正規表現
    let regex = /[。、・]/;
    // 交通機関を4レコードに分割
    for (let i = 0; i < csv_data.length; i++) {
      // 「、」「。」「・」で分割する
      var traffic_array = csv_data[i][18].split(regex);

      csv_data[i][18] = traffic_array[0]; //通勤経路1_交通機関
      csv_data[i][26] = traffic_array[1]; //通勤経路2_交通機関
      csv_data[i][27] = traffic_array[2]; //通勤経路3_交通機関
      csv_data[i][28] = traffic_array[3]; //通勤経路4_交通機関
    }

    // （経由）利用駅を4レコードに分割
    for (let i = 0; i < csv_data.length; i++) {
      // 「、」「。」「・」で分割する
      var via_array = csv_data[i][20].split(regex);

      csv_data[i][20] = via_array[0]; //通勤経路1_（経由）利用駅
      csv_data[i][29] = via_array[1]; //通勤経路2_（経由）利用駅
      csv_data[i][30] = via_array[2]; //通勤経路3_（経由）利用駅
      csv_data[i][31] = via_array[3]; //通勤経路4_（経由）利用駅
    }

    // 備考を4レコードに分割
    for (let i = 0; i < csv_data.length; i++) {
      // 「、」「。」「・」で分割する
      var remarks_array = csv_data[i][22].split('　');

      csv_data[i][22] = remarks_array[0]; //通勤経路1_備考
      csv_data[i][32] = remarks_array[1]; //通勤経路2_備考
      csv_data[i][33] = remarks_array[2]; //通勤経路3_備考
      csv_data[i][34] = remarks_array[3]; //通勤経路4_備考
    }
  }

    return csv_data
}