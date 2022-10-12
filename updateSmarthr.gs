function proclamationShrMain() {
  try{
    var work = '発令';
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

    // CSVファイルを取得
    log('2. CSVファイルより対象データ取得', 's');
    let csv_announcement = import_csv(operation_type = 3.1)
    let csv_travel_allowance = import_csv(operation_type = 3.2)
    let csv_sub_business = import_csv(operation_type = 3.3)
    let csv_proclamation_history = import_csv(operation_type = 3.4)
    let csv_main_hstory = import_csv(operation_type = 3.5)

    let smartHR_data = changeDataToSHR(csv_announcement, operation_type = 3.1);

    // 3. SmartHRへのデータ更新
    for (let i = 0; i < smartHR_data.length; i++) {
      callShrApi(smartHR_data[i],operation_type = 3.1);
    } 
    log('2. CSVファイルより対象データ取得', 'e');
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

  // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
        csv_data[i][0] = '0'+ csv_data[i][0];
    }

    // for(let i = 0; i < csv_announcement.length; i++) {

    //   let data = [
    //     ("00000" + csv_announcement[i][0]).slice(-5),//職種　社員コード 5桁に変換
    //     csv_announcement[i][16],//雇用形態　社員区分
    //     csv_announcement[i][8],//職種
    //     csv_announcement[i][2],//所属名
    //     csv_announcement[i][12],//役職 
    //     csv_announcement[i][6],//グレード
    //     csv_announcement[i][10],//レベル
    //     csv_announcement[i][14],//勤務地
    //   ]

    //   for(let j = 0; j < csv_travel_allowance.length; j++) {
    //     //同じ社員番号のデータを取得
    //     if(csv_travel_allowance[j][1] === csv_announcement[i][0]) {
    //       data.push(csv_travel_allowance[j][18])//交通機関
    //       data.push(csv_travel_allowance[j][19])//乗車区間発
    //       data.push(csv_travel_allowance[j][20])//乗車区間経由
    //       data.push(csv_travel_allowance[j][21])//乗車区間着
    //       data.push(csv_travel_allowance[j][9])//設定金額
    //       data.push(csv_travel_allowance[j][22])//備考
    //     }
    //   }

    //   smartHR_data.push(data);

    // }
    // return smartHR_data
    return csv_data
}