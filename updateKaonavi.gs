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

// 兼務発令コード
let kenmu_proclamation = [
  '8000',
  '8020',
  '8100',
  '8120',
  '8200',
  '8220'
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
    // kaonaviSheetsUpdateApi(sheets_id,member_traffic_data);
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
    // kaonaviUpdateApi(member_kenmu_data);
    log('3. カオナビへのデータ更新（兼務）', 'e');

    // 3. カオナビへのデータ更新（兼務）
    log('3. カオナビへのデータ更新（所属/役職履歴）', 's');
    // 1.本務経歴データ・発令履歴兼務データのインポート
    //clear
    // 2.「不要発令」「所属名/兼務所属名が空」の列削除
    //clear

    // 社員番号が一致するものを配列に集める
    for (let i = 0; i < kaonavi_honmu_keireki_data.length; i++) {
      // 社員番号を取り出す
      var his_emp_code = kaonavi_honmu_keireki_data[i][0];
      var emp_data = []; // 同じ社員番号行を格納する配列
      for(let n = 0; n < kaonavi_honmu_keireki_data.length; n++){
        // 社員番号一致で配列にする
        if(his_emp_code == kaonavi_honmu_keireki_data[n][0]){
          if(emp_data.length === 0){
            emp_data = kaonavi_honmu_keireki_data[n];
            var num = n;
          } else {
            emp_data.push(emp_data,kaonavi_honmu_keireki_data[n]);
            var num = n;
          }
          i = num; // 結合しただけiを進める
        }
      }
      console.log(emp_data);
      throw new Error('next→社員番号一致した配列を回してカスタムフィールドを作る');
    }

    // 3.本務経歴データを1レコードづつループ
    for (let i = 0; i < kaonavi_honmu_keireki_data.length; i++) {
      // 3-2.兼務データを回して「社員コード/発令日」=「社員コード/兼務発令日」が一致するレコードを結合
      for (let n = 0; n < kaonavi_kenmu_rireki_data.length; n++) {
        // 社員コードと発令日が一致する
        if(
          kaonavi_honmu_keireki_data[i][0] == kaonavi_kenmu_rireki_data[n][0] &&
          kaonavi_honmu_keireki_data[i][2] == kaonavi_kenmu_rireki_data[n][2]
          ){
          if(typeof his_data == "undefined"){
            let his_data = [
              kaonavi_honmu_keireki_data[i][0], // 社員コード
              kaonavi_honmu_keireki_data[i][2], // 発令日
              kaonavi_honmu_keireki_data[i][6], // 本務所属名
              kaonavi_honmu_keireki_data[i][17], // 人事役職名
              kaonavi_kenmu_rireki_data[n][17], // 人事役職名
            ];
          }
        }
      }
    }

    // 4.結合したレコードでpayload作成
    // 4-2.一つの社員コードで複数レコード（複数のカスタムフィールドの塊）を作る
    // 4-3.4-2で作ったものを全部結合

    // 5.カオナビシート更新API

    log('3. カオナビへのデータ更新（所属/役職履歴）', 'e');
    
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
  }else if(operation_type == 3.5){
    csv_data.shift(); //見出し行の削除

    // 所属名が空のものを削除
    for (let i = 0; i < csv_data.length; i++) {
      if(csv_data[i][6] == ''){
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
    // 兼務コード行削除
    // for (let i = 0; i < csv_data.length; i++) {
    //   if(kenmu_proclamation.includes(csv_data[i][4])){
    //       csv_data.splice(i,1); 
    //       i = i - 1;
    //   }
    // }
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