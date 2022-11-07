// 定数宣言
// 不要発令コード
let no_proclamation = [
  '1061',
  '1062',
  '1063',
  '1064',
  '1065',
  '1070',
  '2010',
  '2011',
  '2020',
  '2030',
  '2040',
  '2051',
  '2060',
  '5000',
  '5010',
  '5011',
  '5020',
  '5030',
  '5040',
  '5050',
  '5060',
  '5070',
  '5080',
  '5090',
  '5100',
  '5101',
  '6000',
  '6010',
  '6011',
  '6020',
  '6030',
  '6040',
  '6050',
  '6060',
];

// 本務レコード区分名
let honmu_sec = [
  '本務',
  '出向',
];

// 入社区分名
let join_sec = [
  '入社（新卒正社員）',
  '入社（新卒契約社員）',
  '入社（中途正社員）',
  '入社（中途契約社員）',
  '入社（再雇用正社員）',
  '入社（再雇用契約社員）',
  '入社（再雇用ｱﾙﾊﾞｲﾄ長期）',
  '入社（再雇用ｱﾙﾊﾞｲﾄ短期）',
  '入社（研修生ｱﾙﾊﾞｲﾄ）',
  '入社（臨時ｱﾙﾊﾞｲﾄ長期）',
  '入社（臨時ｱﾙﾊﾞｲﾄ短期）',
  '入社（嘱託再雇用）',
  '入社（移籍受入）',
  '入社（兼務受入）',
  '入社（出向受入）',
  '入社（役員登用）',
  '入社（顧問）',
];

// 兼務発令コード
let kenmu_codes = [
  '8000',
  '8100',
  '8200',
];

// 兼務解除発令コード
let release_kenmu_codes = [
  '8020',
  '8120',
  '8220',
];

// 兼務発令コード
let kenmu_proclamation = [
  '8000',
  '8020',
  '8100',
  '8120',
  '8200',
  '8220'
];

// グレード・レベル発令コード
let grade_codes = [
  '2020',
  '2030',
];

// 発令（カオナビ）メイン処理
function proclamationKaonaviMain() {
  try{
    var work = '発令(カオナビ更新)';
    // 開始ログ
    log(work, 's');
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
    let csv_main_history = import_csv(operation_type = 3.5)


    let kaonavi_data = changeDataToKaonavi(csv_announcement, operation_type = 3.1);
    let kaonavi_tsukin_data = changeDataToKaonavi(csv_travel_allowance, operation_type = 3.2);
    let kaonavi_kenmu_data = changeDataToKaonavi(csv_sub_business, operation_type = 3.3);
    let kaonavi_kenmu_rireki_data = changeDataToKaonavi(csv_proclamation_history, operation_type = 3.4);
    let kaonavi_honmu_keireki_data = changeDataToKaonavi(csv_main_history, operation_type = 3.5);

    log('2. CSVファイルより対象データ取得', 'e');

    // 3. カオナビへのデータ更新’（現職本務）
    log('3. カオナビへのデータ更新’（現職本務）', 's');
    // ループで各従業員の更新JSONを作成し、連結する
    for (let i = 0; i < kaonavi_data.length; i++) {
      // var kaonavi_id = matchEmpCode(kaonavi_data[i][0],member_list);

      // 更新JSONを作成
      var payload = makePayload(kaonavi_data[i],member_custom_list,operation_type = 3.1);

      // 連想配列(object)をJSON文字列に変換
      var payload = JSON.stringify(payload);　

      // 各従業員の連想配列（JSON文字列）を連結させる
      if(typeof member_data == "undefined"){
        var member_data = payload;
      } else {
        member_data = member_data + ',' + payload;
      }
    } 
    // カオナビ更新API
    kaonaviUpdateApi(member_data);
    log('3. カオナビへのデータ更新’（現職本務）', 'e');



    // 3. カオナビへのデータ更新（通勤手当）
    log('3. カオナビへのデータ更新（通勤手当）', 's');
    for (let i = 0; i < kaonavi_tsukin_data.length; i++) {
      var sheets_name = '通勤経路';
      var sheets_id = matchSheets(sheets_name);

      // 更新JSONを作成
      var payload = makePayload(kaonavi_tsukin_data[i],member_custom_list,operation_type = 3.2);

      // 連想配列(object)をJSON文字列に変換
      var payload = JSON.stringify(payload);　

      // 各従業員の連想配列（JSON文字列）を連結させる
      if(typeof member_traffic_data == "undefined"){
        var member_traffic_data = payload;
      } else {
        member_traffic_data = member_traffic_data + ',' + payload;
      }
    }
    // カオナビシート更新API
    kaonaviSheetsUpdateApi(sheets_id,member_traffic_data);
    log('3. カオナビへのデータ更新（通勤手当）', 'e');



    // 3. カオナビへのデータ更新（兼務）
    log('3. カオナビへのデータ更新（兼務）', 's');
    // ループで各従業員の更新JSONを作成し、連結する
    for (let i = 0; i < kaonavi_data.length; i++) {
      // 現職本務データループ中に現職兼務をループして、兼務情報を取得
      // 兼務情報をループ
      var count = 0;
      labelIn:
      for (let n = 0; n < kaonavi_kenmu_data.length; n++) {
        // 現職本務の1レコードと社員番号が一致するか、一致してたらカウント
        if(kaonavi_kenmu_data[n][5] == ''){
          continue labelIn;
        }
        
        if(kaonavi_data[i][0] == kaonavi_kenmu_data[n][0] && count == 0){
          kaonavi_data[i][21] = kaonavi_kenmu_data[n][5]; // 兼務2
          count = count + 1;
        }
        else if(kaonavi_data[i][0] == kaonavi_kenmu_data[n][0] && count == 1){
          kaonavi_data[i][22] = kaonavi_kenmu_data[n][5]; // 兼務3
          count = count + 1;
        }
        else if(kaonavi_data[i][0] == kaonavi_kenmu_data[n][0] && count == 2){
          kaonavi_data[i][23] = kaonavi_kenmu_data[n][5]; // 兼務4
          count = count + 1;
        }
        else if(kaonavi_data[i][0] == kaonavi_kenmu_data[n][0] && count == 3){
          kaonavi_data[i][24] = kaonavi_kenmu_data[n][5]; // 兼務4
          count = count + 1;
          break;
        }
      }
    }
    for (let i = 0; i < kaonavi_data.length; i++) {
      // 更新JSONを作成
      var kenmu_payload = makePayload(kaonavi_data[i],member_custom_list,operation_type = 3.3);

      // 兼務情報が一つもないならスキップ
      if(kenmu_payload == null){
        continue;
      }

      // 連想配列(object)をJSON文字列に変換
      var kenmu_payload = JSON.stringify(kenmu_payload);

      // 各従業員の連想配列（JSON文字列）を連結させる
      if(typeof member_kenmu_data == "undefined"){
        var member_kenmu_data = kenmu_payload;
      } else {
        member_kenmu_data = member_kenmu_data + ',' + kenmu_payload;
      }
    }
    // カオナビ更新API
    kaonaviUpdateApi(member_kenmu_data);
    log('3. カオナビへのデータ更新（兼務）', 'e');

    // 3. カオナビへのデータ更新（兼務）
    log('3. カオナビへのデータ更新（所属/役職履歴）', 's');
    // 1.本務経歴データ・発令履歴兼務データのインポート
    // 2.「不要発令」「所属名が空」「退職休職」の列削除
    var sheets_name = '所属・役職履歴';
    var sheets_id = matchSheets(sheets_name);
    var custom_member_array = [];
    // 社員番号が一致するものを配列に集める
    for (let i = 0; i < kaonavi_honmu_keireki_data.length; i++) {
      // 社員番号を取り出す
      let his_emp_code = kaonavi_honmu_keireki_data[i][0];
      let emp_data = []; // 同じ社員番号行を格納する配列
      let sub_emp_data = []; // 同じ社員番号行を格納する配列
      for(let n = 0; n < kaonavi_honmu_keireki_data.length; n++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_honmu_keireki_data[n][0]){
          if(emp_data.length === 0){
            emp_data = [kaonavi_honmu_keireki_data[n]];
            var num = n;
          } else {
            emp_data.push(kaonavi_honmu_keireki_data[n]);
            var num = n;
          }
          i = num; // 結合しただけiを進める
        }
      }
      // 発令履歴兼務データから同じ社員番号の二次元配列を作成
      for(let j = 0; j < kaonavi_kenmu_rireki_data.length; j++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_kenmu_rireki_data[j][0]){
          if(sub_emp_data.length === 0){
            sub_emp_data = [kaonavi_kenmu_rireki_data[j]];
          } else {
            sub_emp_data.push(kaonavi_kenmu_rireki_data[j]);
          }
        }
      }
      // 社員番号一致している配列を1レコードづつループさせる
      let dep_his_payload = createRecord(emp_data,sub_emp_data,sheets_name);
      custom_member_array.push(dep_his_payload);
    }
    // 所属・役職履歴の更新
    kaonaviSheetsUpdateApi(sheets_id,custom_member_array);
    log('3. カオナビへのデータ更新（所属/役職履歴）', 'e');

    // 3. カオナビへのデータ更新（兼務）
    log('3. カオナビへのデータ更新（配属履歴）', 's');
    // 1.本務経歴データ・発令履歴兼務データのインポート
    // 2.「不要発令」「所属名が空」「退職休職」の列削除
    var sheets_name = '配属履歴';
    var sheets_id = matchSheets(sheets_name);
    var custom_member_dep_array = [];
    // 社員番号が一致するものを配列に集める
    for (let i = 0; i < kaonavi_honmu_keireki_data.length; i++) {
      // 社員番号を取り出す
      let his_emp_code = kaonavi_honmu_keireki_data[i][0];
      let emp_data = []; // 同じ社員番号行を格納する配列
      let sub_emp_data = []; // 同じ社員番号行を格納する配列
      for(let n = 0; n < kaonavi_honmu_keireki_data.length; n++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_honmu_keireki_data[n][0]){
          if(emp_data.length === 0){
            emp_data = [kaonavi_honmu_keireki_data[n]];
            var num = n;
          } else {
            emp_data.push(kaonavi_honmu_keireki_data[n]);
            var num = n;
          }
          i = num; // 結合しただけiを進める
        }
      }
      // 発令履歴兼務データから同じ社員番号の二次元配列を作成
      for(let j = 0; j < kaonavi_kenmu_rireki_data.length; j++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_kenmu_rireki_data[j][0]){
          if(sub_emp_data.length === 0){
            sub_emp_data = [kaonavi_kenmu_rireki_data[j]];
          } else {
            sub_emp_data.push(kaonavi_kenmu_rireki_data[j]);
          }
        }
      }
      // 社員番号一致している配列を1レコードづつループさせる
      let dep_his_payload = createRecord(emp_data,sub_emp_data,sheets_name);
      custom_member_dep_array.push(dep_his_payload);
    }
    // 配属履歴の更新
    kaonaviSheetsUpdateApi(sheets_id,custom_member_dep_array);
    log('3. カオナビへのデータ更新（配属履歴）', 'e');


        // 3. カオナビへのデータ更新（兼務）
    log('3. カオナビへのデータ更新（役職履歴）', 's');
    // 1.本務経歴データ・発令履歴兼務データのインポート
    // 2.「不要発令」「所属名が空」「退職休職」の列削除
    var sheets_name = '役職履歴';
    var sheets_id = matchSheets(sheets_name);
    var custom_member_pos_array = [];
    // 社員番号が一致するものを配列に集める
    for (let i = 0; i < kaonavi_honmu_keireki_data.length; i++) {
      // 社員番号を取り出す
      let his_emp_code = kaonavi_honmu_keireki_data[i][0];
      let emp_data = []; // 同じ社員番号行を格納する配列
      let sub_emp_data = []; // 同じ社員番号行を格納する配列
      for(let n = 0; n < kaonavi_honmu_keireki_data.length; n++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_honmu_keireki_data[n][0]){
          if(emp_data.length === 0){
            emp_data = [kaonavi_honmu_keireki_data[n]];
            var num = n;
          } else {
            emp_data.push(kaonavi_honmu_keireki_data[n]);
            var num = n;
          }
          i = num; // 結合しただけiを進める
        }
      }
      // 発令履歴兼務データから同じ社員番号の二次元配列を作成
      for(let j = 0; j < kaonavi_kenmu_rireki_data.length; j++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_kenmu_rireki_data[j][0]){
          if(sub_emp_data.length === 0){
            sub_emp_data = [kaonavi_kenmu_rireki_data[j]];
          } else {
            sub_emp_data.push(kaonavi_kenmu_rireki_data[j]);
          }
        }
      }
      // 社員番号一致している配列を1レコードづつループさせる
      let dep_his_payload = createRecord(emp_data,sub_emp_data,sheets_name);
      custom_member_pos_array.push(dep_his_payload);
    }
    // 役職履歴の更新
    kaonaviSheetsUpdateApi(sheets_id,custom_member_pos_array);
    log('3. カオナビへのデータ更新（役職履歴）', 'e');


    log('3. カオナビへのデータ更新（グレード履歴）', 's');
    // 本務経歴データを再インポート
    let csv_main_grade_history = import_csv(operation_type = 3.5);
    
    // 発令名「グレード変更」のレコードに抽出
    let kaonavi_honmu_keireki_grade_data = changeDataToKaonavi(csv_main_grade_history, operation_type = 3.6);
    var sheets_name = 'グレード履歴';
    var sheets_id = matchSheets(sheets_name);
    var custom_grade_array = [];
    // 社員番号が一致するものを配列に集める
    for (let i = 0; i < kaonavi_honmu_keireki_grade_data.length; i++) {
      // 社員番号を取り出す
      let his_emp_code = kaonavi_honmu_keireki_grade_data[i][0];
      let emp_data = []; // 同じ社員番号行を格納する配列
      let sub_emp_data = []; // 同じ社員番号行を格納する配列
      for(let n = 0; n < kaonavi_honmu_keireki_grade_data.length; n++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_honmu_keireki_grade_data[n][0]){
          if(emp_data.length === 0){
            emp_data = [kaonavi_honmu_keireki_grade_data[n]];
            var num = n;
          } else {
            emp_data.push(kaonavi_honmu_keireki_grade_data[n]);
            var num = n;
          }
          i = num; // 結合しただけiを進める
        }
      }
      let grade_payload = createRecord(emp_data,null,sheets_name);
      custom_grade_array.push(grade_payload);
    }
    // グレード履歴の更新
    kaonaviSheetsUpdateApi(sheets_id,custom_grade_array);
    log('3. カオナビへのデータ更新（グレード履歴）', 'e');
    
    log(work, 'e');

    // 成功メールを送信
    sendMail(work);
    // 終了ログ
    log('発令' + 'エラー内容：'+e.message, 'e');
  }catch(e){
    // メール本文に記載するエラー内容
    var error_message = 'エラー内容：'+e.message;
    // 失敗メールを送信
    sendMail(work,error_message);
    // 終了ログ
    log('発令' + 'エラー内容：'+e.message, 'e');
  }
}

/**
 * CSVデータを加工する
 * @param {array} csv_data  加工前CSV配列
 * @param {integer} operation_type  業務（シート別）
 * return {array} csv_data 加工後配列
 */
function changeDataToKaonavi(csv_data,operation_type) {

  if(operation_type == 3.1){
    // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][0] = '0'+ csv_data[i][0];
    }

    // 退職日（yyyy/mm/dd → yyyy-mm-dd）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][20] = csv_data[i][20].replace(/\//g, '-');
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

  }else if(operation_type == 3.2){

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
    // csv_data.shift(); //見出し行の削除
    // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][1] = '0'+ csv_data[i][1];
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
  }else if(operation_type == 3.4){
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][0] = '0'+ csv_data[i][0];
    }

    // 発令日（yyyy/mm/dd → yyyy-mm-dd）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][2] = csv_data[i][2].replace(/\//g, '-');
    }

  }else if(operation_type == 3.5){
    csv_data.shift(); //見出し行の削除
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][0] = '0'+ csv_data[i][0];
    }
    // 所属名が空のものを削除
    for (let i = 0; i < csv_data.length; i++) {
      if(csv_data[i][6] == ''){
          csv_data.splice(i,1); 
          i = i - 1;
      }
    }
    // 本務レコード区分名が「退職」「休職・復職」の行削除
    for (let i = 0; i < csv_data.length; i++) {
      if(csv_data[i][3] == '退職' || csv_data[i][3] == '休職・復職'){
          csv_data.splice(i,1); 
          i = i - 1;
      }
    }
    // 不要発令コード行削除
    for (let i = 0; i < csv_data.length; i++) {
      if(no_proclamation.includes(csv_data[i][4])){
          csv_data.splice(i,1); 
          i = i - 1;
      }
    }
    // 発令日（yyyy/mm/dd → yyyy-mm-dd）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][2] = csv_data[i][2].replace(/\//g, '-');
    }
    // 兼務コード行削除
    // for (let i = 0; i < csv_data.length; i++) {
    //   if(kenmu_proclamation.includes(csv_data[i][4])){
    //       csv_data.splice(i,1); 
    //       i = i - 1;
    //   }
    // }
  }else if(operation_type == 3.6){
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][0] = '0'+ csv_data[i][0];
    }

    // 発令日（yyyy/mm/dd → yyyy-mm-dd）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][2] = csv_data[i][2].replace(/\//g, '-');
    }

    // レベル名
    for (let i = 0; i < csv_data.length; i++) {
      var delete_str = csv_data[i][15].slice(0,3); //文字列の最初から3文字目まで切り出す
      csv_data[i][15] = csv_data[i][15].replace(delete_str, "");
      console.log(csv_data[i][15]);
    }

    // 「グレードレベル（G）変更、グレードレベル（L）変更」発令コード抽出
    csv_grade_data = [];
    for (let i = 0; i < csv_data.length; i++) {
      if(grade_codes.includes(csv_data[i][4])){
        csv_grade_data.push(csv_data[i]);
      }
    }
    csv_data = csv_grade_data;
  }
  return csv_data
}


/**
 * CSVデータの社員番号とAPI呼び出し社員番号を一致させる。
 * @param {string} emp_code  CSV社員コード
 * @param {array} member_list  全従業員情報
 * @return {string} id カオナビID
 */
function matchEmpCode(emp_code,member_list) {
  // カオナビの全従業員情報jsonをループ
  for (let i = 0; i < member_list.length; i++) {
    // API取得した社員番号を宣言
    var api_emp_code = member_list[i]['code'];

    // API取得した社員番号
    if(emp_code == api_emp_code){
      // カオナビ固有ID
      var id = member_list[i]['id'];
    }
  }
  if(typeof id == "undefined"){
    throw new Error("カオナビに該当のIDが見つかりませんでした。");
  }
  return id;
}

/**
 * 所属・役職履歴の1レコードを作成する
 * @param {array} emp_data  社員番号が一致している二次元配列(本務経歴)
 * @param {array} sub_emp_data  社員番号が一致している二次元配列(発令履歴兼務データ)
 * @param {string} sheet_name  どのシート名か
 * @return {array} dep_payload カオナビ更新Json
 */
function createRecord(emp_data,sub_emp_data,sheet_name) {
  // payload作成
  let custom_array = [];
  if(sheet_name == 'グレード履歴'){
    for(let i = 0; i < emp_data.length; i++){
      merge_data = mergeRecord(emp_data[i],null,sheet_name);
      custom_array.push(merge_data);
    }
  } else {
    // 社員番号一致している配列を1レコードづつループさせる
    for(let i = 0; i < emp_data.length; i++){
      // 本務情報に兼務情報が結合された一次元配列を返す
      if(emp_data[i][3] == '本務' || emp_data[i][3] == '出向'){
        merge_data = mergeRecord(emp_data[i],sub_emp_data,sheet_name);
        // payloadにカスタムフィールドをプッシュする
      } 
      else if(emp_data[i][3] == '兼務'){
        // 「兼務」の場合のメソッド
        // （本務経歴）該当兼務レコードより昔かつその中で一番新しい日付の本務レコードを取得する
        let connect_data = [];

        for(let n = 0; n < emp_data.length; n++){
          let date = new Date(emp_data[i][2]);//兼務区分発令日（本務経歴）
          let sub_date = new Date(emp_data[n][2]);//本務経歴発令日（発令履歴兼務）
          if(date.getTime() > sub_date.getTime() && honmu_sec.includes(emp_data[n][3])){
            if(connect_data.length === 0){
              connect_data = [emp_data[n]];
            } else {
              connect_data.push(emp_data[n]);
              connect_data.sort(function(a, b) {
                return new Date(b[2]) - new Date(a[2]);
              });
            }
          }
        }
        for(let y = 0; connect_data.length > 1; y++){
          if(connect_data.length > 1){
            connect_data.shift();
          }
        }
        merge_data = mergeRecord(connect_data[0],sub_emp_data,sheet_name);
      }
      custom_array.push(merge_data);
    }
  }

  custom_array.flat();

  var dep_payload = {
    code : emp_data[0][0],
    records : custom_array,
  }
  
  return  JSON.stringify(dep_payload)

}

/**
 * 所属・役職履歴の1レコードを作成する
 * @param {array} emp_data[i]  社員番号が一致している一次元配列(本務経歴データ)
 * @param {array} sub_emp_data  社員番号が一致している二次元配列(発令履歴兼務データ)
 * @param {string} sheet_name  どのシート名か
 * @return {array} custom_fields payloadのカスタムフィールド部分オブジェクトを返却
 */
function mergeRecord(emp_data,sub_emp_data,sheet_name) {
  if(sheet_name == 'グレード履歴'){
    // 本務経歴データを再インポート
    let csv_main_grade_history = import_csv(operation_type = 3.5);
    let kaonavi_honmu_keireki_grade_data = changeDataToKaonavi(csv_main_grade_history, operation_type = 3.6);

    // レコードの発令日より新しい発令をまとめて、その中で一番古い発令の前日を代入する
    var grade_end_list = [];
    for (let i = 0; i < kaonavi_honmu_keireki_grade_data.length; i++) {
      var old_ago_day = new Date(emp_data[2]);
      var old_end_day = new Date(kaonavi_honmu_keireki_grade_data[i][2]);
      // old_ago_day.setDate(old_ago_day.getDate()-1);
      // old_ago_day = Utilities.formatDate(old_ago_day, 'Asia/Tokyo', 'yyyy-MM-dd');

      if(old_ago_day.getTime() < old_end_day.getTime() ){
        grade_end_list.push(kaonavi_honmu_keireki_grade_data[i]);
        grade_end_list.sort(function(a, b) {
          return new Date(b[2]) - new Date(a[2]);
        });
      }
    }
    for(let y = 0; grade_end_list.length > 1; y++){
      if(grade_end_list.length > 1){
        grade_end_list.shift();
      }
    }
    if(typeof(grade_end_list[0]) === "undefined"){
      var end_date = '';
    } else{
      var end_date = new Date(grade_end_list[0][2]);
      end_date.setDate(end_date.getDate()-1);
      end_date = Utilities.formatDate(end_date, 'Asia/Tokyo', 'yyyy-MM-dd');
    }



    for (let i = 0; i < sheets_list.length; i++) {
      if(sheets_list[i]['name'] == 'グレード履歴'){
        grade_list = sheets_list[i]['custom_fields'];
      }
    }
    if(typeof grade_list == "undefined"){
      throw new Error("グレード履歴シートが見つかりませんでした。");
    }

    for (let i = 0; i < grade_list.length; i++) {
      // 取得APIリストのnameがカスタム項目名と一致するか
      if(grade_list[i]['name'] == '開始日'){
        var date_id = grade_list[i]['id']; // 項目名IDを宣言
        break;
      }
    }
    // 項目名IDが未定義なら空で宣言
    if(typeof date_id == "undefined"){
      var date_id = '';
    }

    // カスタム（終了日）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < grade_list.length; i++) {
      // 取得APIリストのnameがカスタム項目名と一致するか
      if(grade_list[i]['name'] == '終了日'){
        var end_date_id = grade_list[i]['id']; // 項目名IDを宣言
        break;
      }
    }
    // 項目名IDが未定義なら空で宣言
    if(typeof end_date_id == "undefined"){
      var end_date_id = '';
    }

    // カスタム（終了日）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < grade_list.length; i++) {
      // 取得APIリストのnameがカスタム項目名と一致するか
      if(grade_list[i]['name'] == 'グレード'){
        var grade_id = grade_list[i]['id']; // 項目名IDを宣言
        break;
      }
    }
    // 項目名IDが未定義なら空で宣言
    if(typeof grade_id == "undefined"){
      var grade_id = '';
    }

    // カスタム（終了日）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < grade_list.length; i++) {
      // 取得APIリストのnameがカスタム項目名と一致するか
      if(grade_list[i]['name'] == 'レベル'){
        var level_id = grade_list[i]['id']; // 項目名IDを宣言
        break;
      }
    }
    // 項目名IDが未定義なら空で宣言
    if(typeof level_id == "undefined"){
      var level_id = '';
    }

    // グレード履歴JSON作成
    var custom_fields = 
      {
        custom_fields : [
          // 開始日
          {
            id : date_id,
            values : [emp_data[2]]
          },
          // 終了日
          {
            id : end_date_id,
            values : [end_date]
          },
          // グレード名
          {
            id : grade_id,
            values : [emp_data[11]]
          },
          // レベル名
          {
            id : level_id,
            values : [emp_data[15]]
          }
        ]
      }
  } else{
    // 本務レコード区分名が「兼務」/「本務・出向」で条件分岐
    // 発令履歴兼務データから同じ社員番号の二次元配列を作成
    let connect_data = [];　// 結合データ
    let all_kenmu_array = []; // 兼務発令の配列
    let all_kenmu_kaijo_array = []; // 兼務解除発令の配列

    for(let i = 0; i < sub_emp_data.length; i++){
      if(typeof(sub_emp_data) === "undefined"){
        continue;
      }
      // 「発令日より古い」「兼務(社内),兼務(社外)」を作成
      let date = new Date(emp_data[2]);//発令日（本務経歴）
      let sub_date = new Date(sub_emp_data[i][2]);//兼務発令日（発令履歴兼務）
      // 「発令日より兼務発令日が古い」
      if(date.getTime() > sub_date.getTime()){
        if(connect_data.length === 0){
          connect_data = [sub_emp_data[i]];
        } else {
          connect_data.push(sub_emp_data[i]);
        }
      }
    }
    // 一致するレコードがない場合、本務経歴データをそのまま返却
    let kenmu_array = []; // 最新日付4つまでの兼務発令配列
    let kenmu_kaijo_array = []; // 最新日付4つまでの兼務解除発令配列
    // 兼務発令の配列と兼務解除発令の配列を作る
    for(let n = 0; n < connect_data.length; n++){
      if(kenmu_codes.includes(connect_data[n][7])){
        if(all_kenmu_array.length === 0){
          all_kenmu_array = [connect_data[n]];
        } else {
          all_kenmu_array.push(connect_data[n]);
          all_kenmu_array.sort(function(a, b) {
            return new Date(b[2]) - new Date(a[2]);
          });
        }
      }
      else if(release_kenmu_codes.includes(connect_data[n][7])){
        if(all_kenmu_kaijo_array.length === 0){
          all_kenmu_kaijo_array = [connect_data[n]];
        } else {
          all_kenmu_kaijo_array.push(connect_data[n]);
          all_kenmu_kaijo_array.sort(function(a, b) {
            return new Date(b[2]) - new Date(a[2]);
          });
        }
      }
    }
    // 4レコード以上の場合切り捨て
    for(let y = 0; all_kenmu_array.length > 4; y++){
      if(all_kenmu_array.length > 4){
        all_kenmu_array.pop();
      }
    }
    for(let m = 0; all_kenmu_kaijo_array.length > 4; m++){
      if(all_kenmu_kaijo_array.length > 4){
        all_kenmu_kaijo_array.pop();
      }
    }
    // 兼務レコードが兼務解除レコードより古い場合削除
    for(let n = 0; n < all_kenmu_array.length; n++){
      // 削除したレコードで配列が空になってた場合、break
      if(all_kenmu_array.length === 0){
        break;
      }
      let kenmu_dep = all_kenmu_array[n][12]; // 兼務所属名
      let kenmu_date = new Date(all_kenmu_array[n][2]); // 兼務発令日

      for(let j = 0; j < all_kenmu_kaijo_array.length; j++){
        let kenmu_kaijo_dep = all_kenmu_kaijo_array[j][12]; // 兼務所属名
        let kenmu_kaijo_date = new Date(all_kenmu_kaijo_array[j][2]);
        if(kenmu_date.getTime() < kenmu_kaijo_date.getTime() && kenmu_dep == kenmu_kaijo_dep){
          all_kenmu_array.splice(n, 1);
          n = n - 1;
          break;
        }
      }
    }
      //配列の上に本務経歴データを結合する
      all_kenmu_array.unshift(emp_data);

      // custom_fields作成
      // 兼務データを更新分作成
      if(typeof(all_kenmu_array[1]) === "undefined"){
        // 発令履歴兼務（32レコード分のからデータを追加）
        all_kenmu_array.push(['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']);
      }

      if(typeof(all_kenmu_array[2]) === "undefined"){
        // 発令履歴兼務（32レコード分のからデータを追加）
        all_kenmu_array.push(['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']);
      }

      if(typeof(all_kenmu_array[3]) === "undefined"){
        // 発令履歴兼務（32レコード分のからデータを追加）
        all_kenmu_array.push(['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']);
      }

      if(typeof(all_kenmu_array[4]) === "undefined"){
        // 発令履歴兼務（32レコード分のからデータを追加）
        all_kenmu_array.push(['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']);
      }

      if(sheet_name == '所属・役職履歴'){
        // 発令日の前日取得
        // 入社区分なら取得しない
        if(join_sec.includes(all_kenmu_array[0][5])){
          var old_ago_day = '';
        } else {
          var old_ago_day = new Date(all_kenmu_array[0][2]);
          old_ago_day.setDate(old_ago_day.getDate()-1);
          old_ago_day = Utilities.formatDate(old_ago_day, 'Asia/Tokyo', 'yyyy-MM-dd')
        }
        for (let i = 0; i < sheets_list.length; i++) {
          if(sheets_list[i]['name'] == '所属・役職履歴'){
            dep_history_list = sheets_list[i]['custom_fields'];
          }
        }
        if(typeof dep_history_list == "undefined"){
          throw new Error("所属・役職履歴シートが見つかりませんでした。");
        }

        // カスタム（配属開始日）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '配属開始日'){
            var plo_date_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof plo_date_id == "undefined"){
          var plo_date_id = '';
        }

        // カスタム（配属終了日）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '配属終了日'){
            var plo_end_date_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof plo_end_date_id == "undefined"){
          var plo_end_date_id = '';
        }

        // カスタム（本務所属履歴）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '本務所属履歴'){
            var main_bussiness_his_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof main_bussiness_his_id == "undefined"){
          var main_bussiness_his_id = '';
        }

        // カスタム（本務役職履歴）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '本務役職履歴'){
            var main_position_his_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof main_position_his_id == "undefined"){
          var main_position_his_id = '';
        }

        // カスタム（兼務所属履歴1）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務所属履歴1'){
            var sub_bussiness_his1_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_his1_id == "undefined"){
          var sub_bussiness_his1_id = '';
        }

        // カスタム（兼務役職履歴1）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務役職履歴1'){
            var sub_position_his1_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_position_his1_id == "undefined"){
          var sub_position_his1_id = '';
        }

        // カスタム（兼務所属履歴2）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務所属履歴2'){
            var sub_bussiness_his2_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_his2_id == "undefined"){
          var sub_bussiness_his2_id = '';
        }

        // カスタム（兼務役職履歴2）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務役職履歴2'){
            var sub_position_his2_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_position_his2_id == "undefined"){
          var sub_position_his2_id = '';
        }

        // カスタム（兼務所属履歴3）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務所属履歴3'){
            var sub_bussiness_his3_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_his3_id == "undefined"){
          var sub_bussiness_his3_id = '';
        }

        // カスタム（兼務役職履歴3）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務役職履歴3'){
            var sub_position_his3_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_position_his3_id == "undefined"){
          var sub_position_his3_id = '';
        }

        // カスタム（兼務所属履歴4）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務所属履歴4'){
            var sub_bussiness_his4_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_his4_id == "undefined"){
          var sub_bussiness_his4_id = '';
        }

        // カスタム（兼務役職履歴4）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_history_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_history_list[i]['name'] == '兼務役職履歴4'){
            var sub_position_his4_id = dep_history_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_position_his4_id == "undefined"){
          var sub_position_his4_id = '';
        }


        var custom_fields = 
        {
          custom_fields : [
            // 配属開始日
            {
              id : plo_date_id,
              values : [all_kenmu_array[0][2]]
            },
            // 配属終了日
            {
              id : plo_end_date_id,
              values : [old_ago_day]
            },
            // 本務所属履歴
            {
              id : main_bussiness_his_id,
              values : [all_kenmu_array[0][6]]
            },
            // 本務役職履歴
            {
              id : main_position_his_id,
              values : [all_kenmu_array[0][17]]
            },
            // 兼務所属履歴1
            {
              id : sub_bussiness_his1_id,
              values : [all_kenmu_array[1][12]]
            },
            // 兼務役職履歴1
            {
              id : sub_position_his1_id,
              values : [all_kenmu_array[1][24]]
            },
            // 兼務所属履歴2
            {
              id : sub_bussiness_his2_id,
              values : [all_kenmu_array[2][12]]
            },
            // 兼務役職履歴2
            {
              id : sub_position_his2_id,
              values : [all_kenmu_array[2][24]]
            },
            // 兼務所属履歴3
            {
              id : sub_bussiness_his3_id,
              values : [all_kenmu_array[3][12]]
            },
            // 兼務役職履歴3
            {
              id : sub_position_his3_id,
              values : [all_kenmu_array[3][24]]
            },
            // 兼務所属履歴4
            {
              id : sub_bussiness_his4_id,
              values : [all_kenmu_array[4][12]]
            },
            // 兼務役職履歴4
            {
              id : sub_position_his4_id,
              values : [all_kenmu_array[4][24]]
            },
          ]
        }
      } else if(sheet_name == '配属履歴'){
        // 発令日の前日取得
        // 入社区分なら取得しない
        if(join_sec.includes(all_kenmu_array[0][5])){
          var old_ago_day = '';
        } else {
          var old_ago_day = new Date(all_kenmu_array[0][2]);
          old_ago_day.setDate(old_ago_day.getDate()-1);
          old_ago_day = Utilities.formatDate(old_ago_day, 'Asia/Tokyo', 'yyyy-MM-dd')
        }
        for (let i = 0; i < sheets_list.length; i++) {
          if(sheets_list[i]['name'] == '配属履歴'){
            dep_his_list = sheets_list[i]['custom_fields'];
          }
        }
        if(typeof dep_his_list == "undefined"){
          throw new Error("配属履歴シートが見つかりませんでした。");
        }

        // カスタム（配属開始日）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_his_list[i]['name'] == '配属開始日'){
            var plo_date_id = dep_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof plo_date_id == "undefined"){
          var plo_date_id = '';
        }

        // カスタム（配属終了日）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_his_list[i]['name'] == '配属終了日'){
            var plo_end_date_id = dep_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof plo_end_date_id == "undefined"){
          var plo_end_date_id = '';
        }

        // カスタム（本務所属履歴）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_his_list[i]['name'] == '本務所属履歴'){
            var main_bussiness_dep_his_id = dep_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof main_bussiness_dep_his_id == "undefined"){
          var main_bussiness_dep_his_id = '';
        }

        // カスタム（兼務所属履歴1）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_his_list[i]['name'] == '兼務所属履歴1'){
            var sub_bussiness_dep_his_id1 = dep_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_dep_his_id1 == "undefined"){
          var sub_bussiness_dep_his_id1 = '';
        }

        // カスタム（兼務所属履歴2）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_his_list[i]['name'] == '兼務所属履歴2'){
            var sub_bussiness_dep_his_id2 = dep_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_dep_his_id2 == "undefined"){
          var sub_bussiness_dep_his_id2 = '';
        }

        // カスタム（兼務所属履歴3）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_his_list[i]['name'] == '兼務所属履歴3'){
            var sub_bussiness_dep_his_id3 = dep_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_dep_his_id3 == "undefined"){
          var sub_bussiness_dep_his_id3 = '';
        }

        // カスタム（兼務所属履歴4）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < dep_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(dep_his_list[i]['name'] == '兼務所属履歴4'){
            var sub_bussiness_dep_his_id4 = dep_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_dep_his_id4 == "undefined"){
          var sub_bussiness_dep_his_id4 = '';
        }

        var custom_fields = 
        {
          custom_fields : [
            // 配属開始日
            {
              id : plo_date_id,
              values : [all_kenmu_array[0][2]]
            },
            // 配属終了日
            {
              id : plo_end_date_id,
              values : [old_ago_day]
            },
            // 本務所属履歴
            {
              id : main_bussiness_dep_his_id,
              values : [all_kenmu_array[0][6]]
            },
            // 兼務所属履歴1
            {
              id : sub_bussiness_dep_his_id1,
              values : [all_kenmu_array[1][12]]
            },
            // 兼務所属履歴2
            {
              id : sub_bussiness_dep_his_id2,
              values : [all_kenmu_array[2][12]]
            },
            // 兼務所属履歴3
            {
              id : sub_bussiness_dep_his_id3,
              values : [all_kenmu_array[3][12]]
            },
            // 兼務所属履歴4
            {
              id : sub_bussiness_dep_his_id4,
              values : [all_kenmu_array[4][12]]
            },
          ]
        }
      } else if(sheet_name == '役職履歴'){
        // 発令日の前日取得
        // 入社区分なら取得しない
        if(join_sec.includes(all_kenmu_array[0][5])){
          var old_ago_day = '';
        } else {
          var old_ago_day = new Date(all_kenmu_array[0][2]);
          old_ago_day.setDate(old_ago_day.getDate()-1);
          old_ago_day = Utilities.formatDate(old_ago_day, 'Asia/Tokyo', 'yyyy-MM-dd')
        }
        for (let i = 0; i < sheets_list.length; i++) {
          if(sheets_list[i]['name'] == '役職履歴'){
            pos_his_list = sheets_list[i]['custom_fields'];
          }
        }
        if(typeof pos_his_list == "undefined"){
          throw new Error("役職履歴シートが見つかりませんでした。");
        }

        // カスタム（配属開始日）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < pos_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(pos_his_list[i]['name'] == '役職開始日'){
            var plo_date_id = pos_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof plo_date_id == "undefined"){
          var plo_date_id = '';
        }

        // カスタム（配属終了日）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < pos_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(pos_his_list[i]['name'] == '役職終了日'){
            var plo_end_date_id = pos_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof plo_end_date_id == "undefined"){
          var plo_end_date_id = '';
        }

        // カスタム（本務役職履歴）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < pos_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(pos_his_list[i]['name'] == '本務役職履歴'){
            var main_bussiness_pos_his_id = pos_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof main_bussiness_pos_his_id == "undefined"){
          var main_bussiness_pos_his_id = '';
        }

        // カスタム（兼務所属履歴1）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < pos_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(pos_his_list[i]['name'] == '兼務役職履歴1'){
            var sub_bussiness_pos_his_id1 = pos_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_pos_his_id1 == "undefined"){
          var sub_bussiness_pos_his_id1 = '';
        }

        // カスタム（兼務所属履歴2）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < pos_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(pos_his_list[i]['name'] == '兼務役職履歴2'){
            var sub_bussiness_pos_his_id2 = pos_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_pos_his_id2 == "undefined"){
          var sub_bussiness_pos_his_id2 = '';
        }

        // カスタム（兼務所属履歴3）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < pos_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(pos_his_list[i]['name'] == '兼務役職履歴3'){
            var sub_bussiness_pos_his_id3 = pos_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_pos_his_id3 == "undefined"){
          var sub_bussiness_pos_his_id3 = '';
        }

        // カスタム（兼務所属履歴4）のnameが一致するまでループし、template_idを取得する
        for (let i = 0; i < pos_his_list.length; i++) {
          // 取得APIリストのnameがカスタム項目名と一致するか
          if(pos_his_list[i]['name'] == '兼務役職履歴4'){
            var sub_bussiness_pos_his_id4 = pos_his_list[i]['id']; // 項目名IDを宣言
            break;
          }
        }
        // 項目名IDが未定義なら空で宣言
        if(typeof sub_bussiness_pos_his_id4 == "undefined"){
          var sub_bussiness_pos_his_id4 = '';
        }

        var custom_fields = 
        {
          custom_fields : [
            // 配属開始日
            {
              id : plo_date_id,
              values : [all_kenmu_array[0][2]]
            },
            // 配属終了日
            {
              id : plo_end_date_id,
              values : [old_ago_day]
            },
            // 本務所属履歴
            {
              id : main_bussiness_pos_his_id,
              values : [all_kenmu_array[0][17]]
            },
            // 兼務所属履歴1
            {
              id : sub_bussiness_pos_his_id1,
              values : [all_kenmu_array[1][24]]
            },
            // 兼務所属履歴2
            {
              id : sub_bussiness_pos_his_id2,
              values : [all_kenmu_array[2][24]]
            },
            // 兼務所属履歴3
            {
              id : sub_bussiness_pos_his_id3,
              values : [all_kenmu_array[3][24]]
            },
            // 兼務所属履歴4
            {
              id : sub_bussiness_pos_his_id4,
              values : [all_kenmu_array[4][24]]
            },
          ]
        }
      }
  }
  return custom_fields;
}


/**
 * カオナビデータ更新時のJson作成
 * @param {array} processed_data  加工後CSV社員コード
 * 
 * @param {array} member_list  全従業員情報
 * @param {array} member_custom_list  基本情報
 * @param {int} operation_type  業務タイプ（シート別） 
 * 
 * @return {array} payload カオナビ更新Json
 */
function makePayload(processed_data,member_custom_list,operation_type) {

  // 現職本務データ
  if(operation_type == 3.1){
    // カスタム項目のnameが雇用形態に一致するまでループしidを取得
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '雇用形態'){
        var employment_type_id = member_custom_list[i]['id'];
        break;
      }
    }

    // カスタム項目のnameが職種に一致するまでループしidを取得
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '職種'){
        var bussiness_type_id = member_custom_list[i]['id'];
        break;
      }
    }

    // カスタム項目のnameが役職に一致するまでループしidを取得
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '役職'){
        var position_id = member_custom_list[i]['id'];
        break;
      }
    }

    // カスタム項目のnameが勤務地に一致するまでループしidを取得
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '勤務地'){
        var bussiness_locate_id = member_custom_list[i]['id'];
        break;
      }
    }

    //　本務取得
    for (let i = 0; i < department_list.length; i++) {
      if(department_list[i]['name'] == processed_data[3]){
        var department_code = department_list[i]['code'];
      }
    }

    // 更新Json作成
    var payload =
      {
        code: processed_data[0], // 社員コード
        retired_date: processed_data[20], // 社員コード
        // 本務部署
        department: 
          // 雇用形態
          {
            code: department_code,
          },
        // カスタム項目
        custom_fields: [
          // 雇用形態
          {
            id: employment_type_id,
            values: [processed_data[17]],
          },
          // 職種
          {
            id: bussiness_type_id,
            values: [processed_data[9]],
          },
          // 役職
          {
            id: position_id,
            values: [processed_data[13]],
          },
          // 勤務地
          {
            id: bussiness_locate_id,
            values: [processed_data[15]],
          }
        ],
      }
  }// 通勤手当データ
  else if(operation_type == 3.2){
    // 通勤経路シートがあるか確認
    for (let i = 0; i < sheets_list.length; i++) {
      if(sheets_list[i]['name'] == '通勤経路'){
        traffic_list = sheets_list[i]['custom_fields'];
      }
    }
    if(typeof traffic_list == "undefined"){
      throw new Error("通勤経路シートが見つかりませんでした。");
    }

    // カスタム（通勤経路1_交通機関）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      // 取得APIリストのnameがカスタム項目名と一致するか
      if(traffic_list[i]['name'] == '通勤経路1_交通機関'){
        var traffic1_id = traffic_list[i]['id']; // 項目名IDを宣言
        break;
      }
    }
    // 項目名IDが未定義なら空で宣言
    if(typeof traffic1_id == "undefined"){
      var traffic1_id = '';
    }
    // 選択肢が未定義なら空で宣言
    if(typeof processed_data[18] == "undefined"){
      processed_data[18] = '';
    }

    // カスタム（通勤経路2_交通機関）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路2_交通機関'){
        var traffic2_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof traffic2_id == "undefined"){
      var traffic2_id = '';
    }
    if(typeof processed_data[26] == "undefined"){
      processed_data[26] = '';
    }

    // カスタム（通勤経路3_交通機関）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路3_交通機関'){
        var traffic3_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof traffic3_id == "undefined"){
      var traffic3_id = '';
    }
    if(typeof processed_data[27] == "undefined"){
      processed_data[27] = '';
    }

    // カスタム（通勤経路4_交通機関）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路4_交通機関'){
        var traffic4_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof traffic4_id == "undefined"){
      var traffic4_id = '';
    }
    if(typeof processed_data[28] == "undefined"){
      processed_data[28] = '';
    }


    // カスタム（通勤経路1_（発）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路1_(発)利用駅'){
        var departure1_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof departure1_id == "undefined"){
      var departure1_id = '';
    }
    if(typeof processed_data[19] == "undefined"){
      processed_data[19] = '';
    }

    // カスタム（通勤経路2_（発）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路2_(発)利用駅'){
        var departure2_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof departure2_id == "undefined"){
      var departure2_id = '';
    }
    if(typeof processed_data[35] == "undefined"){
      processed_data[35] = '';
    }

    // カスタム（通勤経路3_（発）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路3_(発)利用駅'){
        var departure3_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof departure3_id == "undefined"){
      var departure3_id = '';
    }
    if(typeof processed_data[38] == "undefined"){
      processed_data[38] = '';
    }

    // カスタム（通勤経路4_（発）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路4_(発)利用駅'){
        var departure4_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof departure4_id == "undefined"){
      var departure4_id = '';
    }
    if(typeof processed_data[41] == "undefined"){
      processed_data[41] = '';
    }


    // カスタム（通勤経路.通勤経路1_（経由）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路1_(経由)利用駅'){
        var via1_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof via1_id == "undefined"){
      var via1_id = '';
    }
    if(typeof processed_data[20] == "undefined"){
      processed_data[20] = '';
    }

    // カスタム（通勤経路.通勤経路2_（経由）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路2_(経由)利用駅'){
        var via2_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof via2_id == "undefined"){
      var via2_id = '';
    }
    if(typeof processed_data[29] == "undefined"){
      processed_data[29] = '';
    }

    // カスタム（通勤経路.通勤経路3_（経由）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路3_(経由)利用駅'){
        var via3_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof via3_id == "undefined"){
      var via3_id = '';
    }
    if(typeof processed_data[30] == "undefined"){
      processed_data[30] = '';
    }

    // カスタム（通勤経路.通勤経路4_（経由）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路4_(経由)利用駅'){
        var via4_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof via4_id == "undefined"){
      var via4_id = '';
    }
    if(typeof processed_data[31] == "undefined"){
      processed_data[31] = '';
    }
    


    // カスタム（通勤経路.通勤経路1_（着）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路1_(着)利用駅'){
        var arrival1_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof arrival1_id == "undefined"){
      var arrival1_id = '';
    }

    // カスタム（通勤経路.通勤経路2_（着）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路2_(着)利用駅'){
        var arrival2_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof arrival2_id == "undefined"){
      var arrival2_id = '';
    }
    if(typeof processed_data[36] == "undefined"){
      processed_data[36] = '';
    }

    // カスタム（通勤経路.通勤経路3_（着）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路3_(着)利用駅'){
        var arrival3_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof arrival3_id == "undefined"){
      var arrival3_id = '';
    }
    if(typeof processed_data[39] == "undefined"){
      processed_data[39] = '';
    }

    // カスタム（通勤経路.通勤経路4_（着）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路4_(着)利用駅'){
        var arrival4_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof arrival4_id == "undefined"){
      var arrival4_id = '';
    }
    if(typeof processed_data[42] == "undefined"){
      processed_data[42] = '';
    }


    // カスタム（通勤経路.通勤経路1_定期券金額）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路1_定期券金額'){
        var pass_amount1_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof pass_amount1_id == "undefined"){
      var pass_amount1_id = '';
    }

    // カスタム（通勤経路.通勤経路2_定期券金額）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路2_定期券金額'){
        var pass_amount2_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof pass_amount2_id == "undefined"){
      var pass_amount2_id = '';
    }
    if(typeof processed_data[37] == "undefined"){
      processed_data[37] = '';
    }

    // カスタム（通勤経路.通勤経路3_定期券金額）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路3_定期券金額'){
        var pass_amount3_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof pass_amount3_id == "undefined"){
      var pass_amount3_id = '';
    }
    if(typeof processed_data[40] == "undefined"){
      processed_data[40] = '';
    }

    // カスタム（通勤経路.通勤経路4_定期券金額）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路4_定期券金額'){
        var pass_amount4_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof pass_amount4_id == "undefined"){
      var pass_amount4_id = '';
    }
    if(typeof processed_data[43] == "undefined"){
      processed_data[43] = '';
    }


    // カスタム（通勤経路.通勤経路1_備考）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路1_備考'){
        var remarks1_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof remarks1_id == "undefined"){
      var remarks1_id = '';
    }
    if(typeof processed_data[22] == "undefined"){
      processed_data[22] = '';
    }

    // カスタム（通勤経路.通勤経路2_備考）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路2_備考'){
        var remarks2_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof remarks2_id == "undefined"){
      var remarks2_id = '';
    }
    if(typeof processed_data[32] == "undefined"){
      processed_data[32] = '';
    }

    // カスタム（通勤経路.通勤経路3_備考）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路3_備考'){
        var remarks3_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof remarks3_id == "undefined"){
      var remarks3_id = '';
    }
    if(typeof processed_data[33] == "undefined"){
      processed_data[33] = '';
    }

    // カスタム（通勤経路.通勤経路4_備考）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < traffic_list.length; i++) {
      if(traffic_list[i]['name'] == '通勤経路4_備考'){
        var remarks4_id = traffic_list[i]['id'];
        break;
      }
    }
    if(typeof remarks4_id == "undefined"){
      var remarks4_id = '';
    }
    if(typeof processed_data[34] == "undefined"){
      processed_data[34] = '';
    }

    // 更新Json作成
    var payload =
      {
        code: processed_data[1], // 社員コード
        records: [
          {
          // カスタム項目
          custom_fields: [
            // 通勤経路1_交通機関
            {
              id: traffic1_id,
              values: [processed_data[18]],
            },
            // 通勤経路2_交通機関
            {
              id: traffic2_id,
              values: [processed_data[26]],
            },
            // 通勤経路3_交通機関
            {
              id: traffic3_id,
              values: [processed_data[27]],
            },
            // 通勤経路4_交通機関
            {
              id: traffic4_id,
              values: [processed_data[28]],
            },
            // 通勤経路1_（発）利用駅
            {
              id: departure1_id,
              values: [processed_data[19]],
            },
            // 通勤経路2_（発）利用駅
            {
              id: departure2_id,
              values: [processed_data[35]],
            },
            // 通勤経路3_（発）利用駅
            {
              id: departure3_id,
              values: [processed_data[38]],
            },
            // 通勤経路4_（発）利用駅
            {
              id: departure4_id,
              values: [processed_data[41]],
            },
            // 通勤経路1_（経由）利用駅
            {
              id: via1_id,
              values: [processed_data[20]],
            },
            // 通勤経路2_（経由）利用駅
            {
              id: via2_id,
              values: [processed_data[29]],
            },
            // 通勤経路3_（経由）利用駅
            {
              id: via3_id,
              values: [processed_data[30]],
            },
            // 通勤経路4_（経由）利用駅
            {
              id: via4_id,
              values: [processed_data[31]],
            },
            // 通勤経路1_（着）利用駅
            {
              id: arrival1_id,
              values: [processed_data[21]],
            },
            // 通勤経路2_（着）利用駅
            {
              id: arrival2_id,
              values: [processed_data[36]],
            },
            // 通勤経路3_（着）利用駅
            {
              id: arrival3_id,
              values: [processed_data[39]],
            },
            // 通勤経路4_（着）利用駅
            {
              id: arrival4_id,
              values: [processed_data[42]],
            },
            // 通勤経路1_定期券金額
            {
              id: pass_amount1_id,
              values: [processed_data[9]],
            },
            // 通勤経路2_定期券金額
            {
              id: pass_amount2_id,
              values: [processed_data[37]],
            },
            // 通勤経路3_定期券金額
            {
              id: pass_amount3_id,
              values: [processed_data[40]],
            },
            // 通勤経路4_定期券金額
            {
              id: pass_amount4_id,
              values: [processed_data[43]],
            },
            // 通勤経路1_備考
            {
              id: remarks1_id,
              values: [processed_data[22]],
            },
            // 通勤経路2_備考
            {
              id: remarks2_id,
              values: [processed_data[32]],
            },
            // 通勤経路3_備考
            {
              id: remarks3_id,
              values: [processed_data[33]],
            },
            // 通勤経路4_備考
            {
              id: remarks4_id,
              values: [processed_data[34]],
            }
            ]
          }
        ]
      }
  }// 所属データ
  else if(operation_type == 3.3){
    // 兼務情報が1つもない場合
    if(typeof(processed_data[21]) == "undefined"){
      var count = 0;
    }
    
    // 兼務情報が1つの場合
    if(typeof(processed_data[21]) != "undefined" && typeof processed_data[22] == "undefined"){
      var count = 1;
    }

    // 兼務情報が2つの場合
    if(typeof(processed_data[21]) != "undefined" && typeof processed_data[22] != "undefined" && typeof processed_data[23] == "undefined"){
      var count = 2;
    }

    // 兼務情報が3つの場合
    if(typeof(processed_data[21]) != "undefined" && typeof processed_data[22] != "undefined" && typeof processed_data[23] != "undefined" && typeof processed_data[24] == "undefined"){
      var count = 3;
    }

    // 兼務情報が4つの場合
    if(typeof(processed_data[21]) != "undefined" && typeof processed_data[22] != "undefined" && typeof processed_data[23] != "undefined" && typeof processed_data[24] != "undefined"){
      var count = 4;
    }

    if(count == 0){
      return null;
    } else if(count == 1) {
      // 兼務コードの取得(1つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[21]){
          var department1_code = department_list[i]['code'];
        }
      }
      // 兼務が1つの更新Json作成
      var payload =
      {
        code: processed_data[0], // 社員コード
        // 兼務部署
        sub_departments : [{
          code: department1_code
        }],
      }
    } else if(count == 2) {
      // 兼務コードの取得(1つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[21]){
          var department1_code = department_list[i]['code'];
        }
      }
      // 兼務コードの取得(2つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[22]){
          var department2_code = department_list[i]['code'];
        }
      }
      // 兼務が2つの更新Json作成
      var payload =
      {
        code: processed_data[0], // 社員コード
        // 兼務部署
        sub_departments : [{
          code: department1_code
        },
        {
          code: department2_code
        }
        ],
      }
    } else if(count == 3) {
      // 兼務コードの取得(1つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[21]){
          var department1_code = department_list[i]['code'];
        }
      }
      // 兼務コードの取得(2つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[22]){
          var department2_code = department_list[i]['code'];
        }
      }
      // 兼務コードの取得(3つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[23]){
          var department3_code = department_list[i]['code'];
        }
      }
      // 兼務が3つの更新Json作成
      var payload =
      {
        code: processed_data[0], // 社員コード
        // 兼務部署
        sub_departments : [{
          code: department1_code
        },
        {
          code: department2_code
        },
        {
          code: department3_code
        }
        ],
      }
    } else if(count == 4) {
      // 兼務コードの取得(1つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[21]){
          var department1_code = department_list[i]['code'];
        }
      }
      // 兼務コードの取得(2つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[22]){
          var department2_code = department_list[i]['code'];
        }
      }
      // 兼務コードの取得(3つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[23]){
          var department3_code = department_list[i]['code'];
        }
      }
      // 兼務コードの取得(4つ目)
      for (let i = 0; i < department_list.length; i++) {
        if(department_list[i]['name'] == processed_data[24]){
          var department4_code = department_list[i]['code'];
        }
      }
      // 兼務が4つの更新Json作成
      var payload =
      {
        code: processed_data[0], // 社員コード
        // 兼務部署
        sub_departments : [{
          code: department1_code
        },
        {
          code: department2_code
        },
        {
          code: department3_code
        },
        {
          code: department4_code
        },
        ],
      }
    }
  }
  return payload;
}