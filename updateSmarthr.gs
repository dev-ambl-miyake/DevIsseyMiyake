// 発令（SmartHR）メイン処理
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

    // // 3. SmartHRへのデータ更新’（現職本務）
    log('3. SmartHRへのデータ更新’（現職本務）', 's');
    for (let i = 0; i < smartHR_data.length; i++) {
      callShrApi(smartHR_data[i],operation_type = 3.1);
    } 
    log('3. SmartHRへのデータ更新’（現職本務）', 'e');

    // 3. SmartHRへのデータ更新（兼務）
    log('3. SmartHRへのデータ更新（兼務）', 's');
    for (let i = 0; i < smartHR_data.length; i++) {
      callShrApi(smartHR_data[i],operation_type = 3.3);
    } 
    log('3. SmartHRへのデータ更新（兼務）', 'e');

    // 3. SmartHRへのデータ更新（通勤手当）
    log('3. SmartHRへのデータ更新（通勤手当）', 's');
    for (let i = 0; i < smartHR_tsukin_data.length; i++) {
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

    // 職種 (「総合職」「販売職」「専門職」に加工)
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][9] = csv_data[i][9].substring(0, 3);
      if(csv_data[i][9] == '(総)'){
        csv_data[i][9] = '総合職';
      } else if('(販)'){
        csv_data[i][9] = '販売職';
      } else if('(専)'){
        csv_data[i][9] = '専門職';
      }
    }

    // レベル
    for (let i = 0; i < csv_data.length; i++) {
      var delete_str = csv_data[i][11].slice(0,3); //文字列の最初から3文字目まで切り出す
      csv_data[i][11] = csv_data[i][11].replace(delete_str, "");
    }

  }else if(operation_type == 3.2){
    // csv_data.shift(); //見出し行の削除
    // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][1] = '0'+ csv_data[i][1];
    }

    // 同じ社員コードを1レコードに結合する
    for (let i = 0; i < csv_data.length; i++) {
      var count = 0; // 社員番号が一致した際に加算されるカウント変数
      for (let n = 0; n < csv_data.length; n++) {
        // 社員番号が一致しているレコード && 同じ要素番号を比較していない && カウント
        if(csv_data[i][1] == csv_data[n][1] && csv_data.indexOf(csv_data[i]) != csv_data.indexOf(csv_data[n]) && count == 0){
          // 1回目に一致した時に通勤経路2に値を格納
          csv_data[i][26] = csv_data[n][18]; //通勤経路2_交通機関
          csv_data[i][35] = csv_data[n][19]; //通勤経路2_（発）利用駅
          csv_data[i][36] = csv_data[n][21]; //通勤経路2_（着）利用駅
          csv_data[i][37] = csv_data[n][9]; //通勤経路2_定期券金額
          csv_data[i][29] = csv_data[n][20]; //通勤経路2_（経由）利用駅
          csv_data[i][32] = csv_data[n][22]; //通勤経路2備考
          
          count = count + 1;
          csv_data.splice(n,1); // 結合した分の配列の要素番号を削除
          n = n - 1; // 削除した要素文CSVデータの要素が前詰めするので-1する

          // 社員番号が一致しているレコード && 同じ要素番号を比較していない && カウント
        } else if(csv_data[i][1] == csv_data[n][1] && csv_data.indexOf(csv_data[i]) != csv_data.indexOf(csv_data[n]) && count == 1){
          // 2回目に一致した時に通勤経路3に値を格納
          csv_data[i][27] = csv_data[n][18]; //通勤経路3_交通機関
          csv_data[i][38] = csv_data[n][19]; //通勤経路3_（発）利用駅
          csv_data[i][39] = csv_data[n][21]; //通勤経路3_（着）利用駅
          csv_data[i][40] = csv_data[n][9]; //通勤経路3_定期券金額
          csv_data[i][30] = csv_data[n][20]; //通勤経路3_（経由）利用駅
          csv_data[i][33] = csv_data[n][22]; //通勤経路3_（経由）利用駅
          count = count + 1;
          csv_data.splice(n,1); // 結合した分の配列の要素番号を削除
          n = n - 1; // 削除した要素文CSVデータの要素が前詰めするので-1する

          // 社員番号が一致しているレコード && 同じ要素番号を比較していない && カウント
        } else if(csv_data[i][1] == csv_data[n][1] && csv_data.indexOf(csv_data[i]) != csv_data.indexOf(csv_data[n]) && count == 2){
          // 3回目に一致した時に通勤経路4に値を格納
          csv_data[i][28] = csv_data[n][18]; //通勤経路4_交通機関
          csv_data[i][41] = csv_data[n][19]; //通勤経路4_（発）利用駅
          csv_data[i][42] = csv_data[n][21]; //通勤経路4_（着）利用駅
          csv_data[i][43] = csv_data[n][9]; //通勤経路4_定期券金額
          csv_data[i][31] = csv_data[n][20]; //通勤経路4_（経由）利用駅
          csv_data[i][34] = csv_data[n][22]; //通勤経路4備考
          count = count + 1;
          csv_data.splice(n,1); // 結合した分の配列の要素番号を削除
          break; // 4回一致した場合ループ終了
        }
      }
    }
  }else if(operation_type == 3.3){
  // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][0] = '0'+ csv_data[i][0];
    }

    // 所属略名（加工方法IMIに要確認）
    for (let i = 0; i < csv_data.length; i++) {
      if(csv_data[i][5] == '国内・海外ビジネス担当'){
        csv_data[i][5] = '国内・海外ビジネス';
      }
      if(csv_data[i][5] == '管理・財務担当'){
        csv_data[i][5] = '管理・財務';
      }
      if(csv_data[i][5] == '生産・製造技術開発担当'){
        csv_data[i][5] = '生産・製造技術開発';
      }
      if(csv_data[i][5] == 'コミュニケーションデザイン担当'){
        csv_data[i][5] = 'コミュニケーションデザイン';
      }
      if(csv_data[i][5] == 'プロダクト開発担当'){
        csv_data[i][5] = 'プロダクト開発';
      }
    }
  }

    return csv_data
}