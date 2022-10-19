const employees_api = kaonaviMemberApi(); // カオナビの全従業員情報API
const member_list = employees_api['member_data']; // カオナビの全従業員情報リスト

const member_sheets_api = kaonaviMemberSheetsApi(); // カオナビの基本情報シート情報
const member_custom_list = member_sheets_api['custom_fields']; // カオナビの基本情報シートカスタム項目リスト

const sheets_api = kaonaviSheetsApi(); // カオナビの全シート情報

// 発令（カオナビ）メイン処理
function proclamationKaonaviMain() {
  try{
    var work = '発令(カオナビ更新)';
    // 開始ログ
    log('発令（カオナビ）', 's');
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

    let kaonavi_data = changeDataToSHR(csv_announcement, operation_type = 3.1);
    let kaonavi_tsukin_data = changeDataToSHR(csv_travel_allowance, operation_type = 3.2);
    let kaonavi_kenmu_data = changeDataToSHR(csv_travel_allowance, operation_type = 3.2);
    log('2. CSVファイルより対象データ取得', 'e');

    // 3. カオナビへのデータ更新’（現職本務）
    log('3. カオナビへのデータ更新’（現職本務）', 's');
    
    for (let i = 0; i < kaonavi_data.length; i++) {
      var kaonavi_id = matchEmpCode(kaonavi_data[i][0],member_list);
      if(typeof member_data == "undefined"){
        console.log('a');
        var payload = makeFirstPayload(kaonavi_data[i],member_list,member_custom_list,sheets_api);
      } else {
        console.log('b');
        var payload = makePayload(kaonavi_data[i],member_list,member_custom_list,sheets_api);
      }
      // var payload = JSON.stringify(payload);
      // 連想配列を繋げてpayloadを作成
      if(typeof member_data == "undefined"){
        var member_data = payload;
        console.log(member_data);
      } else {
        member_data = member_data.push(payload);
      }
      console.log(payload);
    } 
    console.log(member_data);
    kaonaviUpdateApi(member_data);
    log('3. カオナビへのデータ更新’（現職本務）', 'e');

    // 3. カオナビへのデータ更新（通勤手当）
    log('3. カオナビへのデータ更新（通勤手当）', 's');
    for (let i = 0; i < kaonavi_tsukin_data.length; i++) {
      callShrApi(kaonavi_tsukin_data[i],operation_type = 3.2);
    } 
    log('3. カオナビへのデータ更新（通勤手当）', 'e');

    // 3. カオナビへのデータ更新（兼務）
    log('3. カオナビへのデータ更新（兼務）', 's');
    for (let i = 0; i < kaonavi_tsukin_data.length; i++) {
      callShrApi(kaonavi_tsukin_data[i],operation_type = 3.2);
    } 
    log('3. カオナビへのデータ更新（兼務）', 'e');

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

/**
 * CSVデータを加工する
 * @param {array} csv_data  加工前CSV配列
 * @param {integer} operation_type  業務（シート別）
 * return {array} csv_data 加工後配列
 */
function changeDataToSHR(csv_data,operation_type) {

  if(operation_type == 3.1){
    // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i][0] = '0'+ csv_data[i][0];
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
          
          count = count++;
          csv_data.splice(n,1); // 結合した分の配列の要素番号を削除

          // 社員番号が一致しているレコード && 同じ要素番号を比較していない && カウント
        } else if(csv_data[i][1] == csv_data[n][1] && csv_data.indexOf(csv_data[i]) != csv_data.indexOf(csv_data[n]) && count == 1){
          // 2回目に一致した時に通勤経路3に値を格納
          csv_data[i][27] = csv_data[n][18]; //通勤経路3_交通機関
          csv_data[i][38] = csv_data[n][19]; //通勤経路3_（発）利用駅
          csv_data[i][39] = csv_data[n][21]; //通勤経路3_（着）利用駅
          csv_data[i][40] = csv_data[n][9]; //通勤経路3_定期券金額
          csv_data[i][30] = csv_data[n][20]; //通勤経路3_（経由）利用駅
          csv_data[i][33] = csv_data[n][22]; //通勤経路3_（経由）利用駅
          count = count++;
          csv_data.splice(n,1); // 結合した分の配列の要素番号を削除

          // 社員番号が一致しているレコード && 同じ要素番号を比較していない && カウント
        } else if(csv_data[i][1] == csv_data[n][1] && csv_data.indexOf(csv_data[i]) != csv_data.indexOf(csv_data[n]) && count == 1){
          // 3回目に一致した時に通勤経路4に値を格納
          csv_data[i][28] = csv_data[n][18]; //通勤経路4_交通機関
          csv_data[i][41] = csv_data[n][19]; //通勤経路4_（発）利用駅
          csv_data[i][42] = csv_data[n][21]; //通勤経路4_（着）利用駅
          csv_data[i][43] = csv_data[n][9]; //通勤経路4_定期券金額
          csv_data[i][31] = csv_data[n][20]; //通勤経路4_（経由）利用駅
          csv_data[i][34] = csv_data[n][22]; //通勤経路4備考
          count = count++;
          csv_data.splice(n,1); // 結合した分の配列の要素番号を削除
          break; // 4回一致した場合ループ終了
        }
      }
    }
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
 * @param {array} sheets_api  全シート情報
 * 
 * @return {array} payload カオナビ更新Json
 */
function makePayload(processed_data,member_list,member_custom_list,sheets_api) {

  // カスタム項目のnameが雇用形態に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '雇用形態'){
        var employment_type_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // カスタム項目のnameが職種に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '職種'){
        var bussiness_type_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // カスタム項目のnameが役職に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '役職'){
        var position_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // カスタム項目のnameが勤務地に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '勤務地'){
        var bussiness_locate_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // 更新Json作成
  var payload =
    {
      'code': processed_data[0], // 社員コード
      // カスタム項目
      'custom_fields': [
        // 雇用形態
        {
          'id': employment_type_id,
          'values': [processed_data[16]],
        },
        // 職種
        {
          'id': bussiness_type_id,
          'values': [processed_data[8]],
        },
        // 役職
        {
          'id': position_id,
          'values': [processed_data[12]],
        },
        // 勤務地
        {
          'id': bussiness_locate_id,
          'values': [processed_data[14]],
        }
      ],
    }
  return payload;
}


/**
 * カオナビデータ更新時のJson作成
 * @param {array} processed_data  加工後CSV社員コード
 * 
 * @param {array} member_list  全従業員情報
 * @param {array} member_custom_list  基本情報
 * @param {array} sheets_api  全シート情報
 * 
 * @return {array} payload カオナビ更新Json
 */
function makeFirstPayload(processed_data,member_list,member_custom_list,sheets_api) {

  // カスタム項目のnameが雇用形態に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '雇用形態'){
        var employment_type_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // カスタム項目のnameが職種に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '職種'){
        var bussiness_type_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // カスタム項目のnameが役職に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '役職'){
        var position_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // カスタム項目のnameが勤務地に一致するまでループしidを取得
  if(processed_data[16] != ""){
    for (let i = 0; i < member_custom_list.length; i++) {
      if(member_custom_list[i]['name'] == '勤務地'){
        var bussiness_locate_id = member_custom_list[i]['id'];
        break;
      }
    }
  }

  // 更新Json作成
  var payload = [
    {
      'code': processed_data[0], // 社員コード
      // カスタム項目
      'custom_fields': [
        // 雇用形態
        {
          'id': employment_type_id,
          'values': [processed_data[16]],
        },
        // 職種
        {
          'id': bussiness_type_id,
          'values': [processed_data[8]],
        },
        // 役職
        {
          'id': position_id,
          'values': [processed_data[12]],
        },
        // 勤務地
        {
          'id': bussiness_locate_id,
          'values': [processed_data[14]],
        }
      ],
    }
  ]
  return payload;
}


















// function kaonaviMain() {
//   let folderId = "1_Yc3q1b8ClYNbOW-orwejJTrfSlczhI8";
//   //ファイル名一覧
//   let regular_business = "announcement.csv";//現職本務
//   let sub_business = "現職兼務データ.csv";//現職兼務
//   let regular_business_history = "本務経歴データ.csv";//本務経歴
//   let sub_business_history = "発令履歴兼務データ.csv";//兼務履歴
//   let travel_allowance = "通勤手当データ.csv";//通勤手当


//   //ファイルが存在する場合のみ実行
//   if(commonFunction.checkExistFile(folderId, regular_business) && commonFunction.checkExistFile(folderId, travel_allowance)) {
//     let csv_regular_business = commonFunction.import_csv(operation_type = 3.1)//現職本務データ取得
//     let csv_travel_allowance = commonFunction.import_csv(operation_type = 3.2)//通勤手当データ取得
//     let csv_sub_business = commonFunction.import_csv(operation_type = 3.3)//現職兼務データ取得

//     //csvにデータが存在する場合のみ実行
//     if(csv_regular_business.length > 0){
//       let kaonavi_data = changeDataToKaonavi(csv_regular_business, csv_travel_allowance);

//       updateKaonavi(kaonavi_data);

//     }
//   }
// }

// function changeDataToKaonavi2(csv_regular_business, csv_travel_allowance) {
  
//   let kaonavi_data = [];

//   try {

//     for(let i = 0; i < csv_regular_business.length; i++) {

//       let data = [
//         ("00000" + csv_regular_business[i][0]).slice(-5),//職種　社員コード 5桁に変換
//         csv_regular_business[i][16],//雇用形態　社員区分
//         csv_regular_business[i][8],//職種
//         csv_regular_business[i][2],//所属名階層あり
//         csv_regular_business[i][12],//役職 
//         csv_regular_business[i][6],//グレード
//         csv_regular_business[i][10],//レベル
//         csv_regular_business[i][19],//退職日
//         csv_regular_business[i][14],//勤務地
//         //採用地 現在obic資料にも存在しません
//         //採用時職種　現在obic資料にも存在しません
//         //配属開始日　発令日
//         //配属終了日　最新の発令日の一日前
//         //本務所属履歴
//         //本務役職履歴
//         //兼務所属履歴1
//         //兼務役職履歴1
//         //兼務所属履歴2
//         //兼務役職履歴2
//         //兼務所属履歴3
//         //兼務役職履歴3
//         //兼務所属履歴4
//         //兼務役職履歴4
//         //配属開始日
//         //配属終了日
//         //所属履歴
//         //兼務所属履歴1
//         //兼務所属履歴2
//         //兼務所属履歴3
//         //兼務所属履歴4
//         //役職開始日
//         //役職終了日
//         //役職履歴
//         //兼務役職履歴1
//         //兼務役職履歴2
//         //兼務役職履歴3
//         //兼務役職履歴4
//         //発令日
//         //終了日
//         //グレード履歴
//         //レベル履歴
//         //発令日
//         //終了日
//         //休職事由
//         //発令名
//         //給与計
//         //G給
//         //貢献調整給
//         //役職給 
//       ]

//       for(let m = 0; m < csv_travel_allowance.length; m++) {
//         //同じ社員番号のデータを取得
//         if(csv_travel_allowance[m][1] === csv_regular_business[i][0]) {
//           data.push(csv_travel_allowance[m][18])//交通機関1
//           data.push(csv_travel_allowance[m][19])//(発)利用駅1
//           data.push(csv_travel_allowance[m][20])//(経由)利用駅1
//           data.push(csv_travel_allowance[m][21])//(着)利用駅1
//           data.push(csv_travel_allowance[m][9])//定期券金額1
//           data.push(csv_travel_allowance[m][22])//備考1
//           //交通機関2
//           //(発)利用駅2
//           //(経由)利用駅2
//           //(着)利用駅2
//           //定期券金額2
//           //備考2
//           //交通機関3
//           //(発)利用駅3
//           //(経由)利用駅3
//           //(着)利用駅3
//           //定期券金額3
//           //備考3
//           //交通機関3
//           //(発)利用駅4
//           //(経由)利用駅4
//           //(着)利用駅4
//           //定期券金額4
//           //備考4
//         }
//       }

//       kaonavi_data.push(data);

//     }
//     return kaonavi_data

//   } catch(e) {

//   }
// }

// function updateKaonavi(kaonavi_data) {







//   try{
//     // 開始ログ
//     commonFunction.log('更新カオナビ連携登録', 's');

//     //基本情報
//     let basicInfoList = [];
//     //データを作成 
//     for(let i = 0; i < kaonavi_data.length; i++) {
      
//       //基本情報
//       let inputDataBasicInfo = {
//         "code" : kaonavi_data[i][0],//社員番号
//         "department" : {
//           "name" : kaonavi_data[i][3]//所属名
//         },
//         "retired_date" : kaonavi_data[i][6],//退職日
//         "custom_fields" : [
//           {
//             "id": 5533,
//             "values" : [
//               kaonavi_data[i][1]//雇用形態
//             ]
//           },
//           {
//             "id": 5534,
//             "values" : [
//               kaonavi_data[i][2]//職種
//             ]
//           },
//           {
//             "id": 5532,
//             "values" : [
//               kaonavi_data[i][4]//役職
//             ]
//           },
//           {
//             "id": 5535,
//             "values" : [
//               kaonavi_data[i][8]//勤務地
//             ]
//           }
//         ]
//       }
//       basicInfoList.push(inputDataBasicInfo)
//     }
//     //通勤手当
//     let travelList = [];
//     //データを作成 
//     for(let i = 0; i < kaonavi_data.length; i++) {
      
//       //基本情報
//       let inputDatatravel = {
//         "code" : kaonavi_data[i][0],//社員番号
//         "records": [
//           {
//             "custom_fields" : [
//               {
//                 "id": 5637,
//                 "values" : [
//                   kaonavi_data[i][0]//社員番号
//                 ]
//               },
//               {
//                 "id": 5638,
//                 "values" : [
//                   kaonavi_data[i][9]//交通機関1
//                 ]
//               },
//               {
//                 "id": 5639,
//                 "values" : [
//                   kaonavi_data[i][10]//（発）利用駅
//                 ]
//               },
//               {
//                 "id": 5640,
//                 "values" : [
//                   kaonavi_data[i][11]//（経由）利用駅1
//                 ]
//               },
//              {
//                 "id": 5641,
//                 "values" : [
//                   kaonavi_data[i][12]//（着）利用駅1
//                ]
//               },
//               {
//                 "id": 5642,
//                 "values" : [
//                   kaonavi_data[i][13]//定期券金額1
//                ]
//               },
//               {
//                 "id": 5643,
//                 "values" : [
//                   kaonavi_data[i][14]//備考1
//                ]
//               }
//             ]
//           }
//         ]
//       }
//       travelList.push(inputDatatravel)
//     }  

//     let json = api(basicInfoList, 0);
//     let json1 = api(travelList, 2);
    
//     //終了ログ
//     commonFunction.log('更新カオナビ連携登録', 'e')
//   }catch(e) {
//     console.log("error")
//   }
// }

// /**
//  * @param {string} status 0:基本情報 1:現住所 2:通勤経路
//  */
// function api(list, status) {

//   const sheetsid_adress = "2078";//現住所シートID
//   const sheetsid_travel = "2088";//通勤経路

//   const token = commonFunction.getToken();

//   let member_data = {
//     "member_data" : list
//   }

//   //APIに必要な情報
//   let apiOptions = {
//     'headers' : {
//       'Kaonavi-Token' : token["access_token"],
//       'Content-Type': 'application/json'
//     },
//     'payload': JSON.stringify(member_data),
//     'method': 'patch',
//     'muteHttpExceptions' : true
//   }
  
//   if(status === 0) {
//     //APIからの返答
//     let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/members', apiOptions).getContentText())
//     return json
//   }else if(status === 1){
//     //APIからの返答
//     let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/' + sheetsid_adress, apiOptions).getContentText())
//     return json
//   }else if(status === 2){
//     //APIからの返答
//     let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/' + sheetsid_travel, apiOptions).getContentText())
//     return json
//   }
// }

//       //現住所シート
//       let inputPresentAddressData = {
//         "code" : changedDate[i].code,
//         "records" : [
//           {
//             "custom_fields" : [
//               {
//                 "id" : 5537,
//                 "values": [
//                   changedDate[i].presentAddress_postalCode
//                 ]
//               },
//               {
//                 "id" : 5538,
//                 "values": [
//                   changedDate[i].presentAddress_prefectures
//                 ]
//               },
//               {
//                 "id" : 5539,
//                 "values": [
//                   changedDate[i].presentAddress_municipalities
//                 ]
//               },
//               {
//                 "id" : 5540,
//                 "values": [
//                   changedDate[i].presentAddress_houseNumber
//                 ]
//               },
//               {
//                 "id" : 5541,
//                 "values": [
//                   changedDate[i].presentAddress_roomNumber
//                 ]
//               },
//               {
//                 "id" : 5542,
//                 "values": [
//                   changedDate[i].pressentAddress_countryCode
//                 ]
//               }
//             ]
//           }
//         ]
//       }