
// 取得APIをグローバル変数で管理
//何ページ分取得するか（登録されている社員数に依存する）
var LAST_PAGE = 2;
//1ページ最大100件まで
var PER_PAGE = 100;

// SmartHRのアクセストークンとサブドメインの宣言
const ACCESS_TOKEN = getProperties("ACCESS_TOKEN");
const SUB_DOMAIN = getProperties("SUB_DOMAIN");

// 雇用形態のリストをAPIで取得
var emp_response = 
"https://"+SUB_DOMAIN+".daruma.space/api/v1/employment_types?page="+"1"+"&per_page="+"100"+"&access_token="+ACCESS_TOKEN;
var emp_responseBody = UrlFetchApp.fetch(emp_response).getContentText();
// 雇用形態のJsonリスト
var emp_json = JSON.parse(emp_responseBody);

// カスタム項目のリストをAPIで取得
var custom_response = 
"https://"+SUB_DOMAIN+".daruma.space/api/v1/crew_custom_field_templates?page="+"1"+"&per_page="+"100"+"&access_token="+ACCESS_TOKEN;
var custom_responseBody = UrlFetchApp.fetch(custom_response).getContentText();
// 雇用形態のJsonリスト
var custom_json = JSON.parse(custom_responseBody);

// 部署のリストをAPIで取得
var dep_response1 = 
"https://"+SUB_DOMAIN+".daruma.space/api/v1/departments?page="+"1"+"&per_page="+"100"+"&access_token="+ACCESS_TOKEN;
var dep_responseBody1 = UrlFetchApp.fetch(dep_response1).getContentText();
var dep_json1 = JSON.parse(dep_responseBody1);

var dep_response2 = 
"https://"+SUB_DOMAIN+".daruma.space/api/v1/departments?page="+"2"+"&per_page="+"100"+"&access_token="+ACCESS_TOKEN;
var dep_responseBody2 = UrlFetchApp.fetch(dep_response2).getContentText();
var dep_json2 = JSON.parse(dep_responseBody2);

var dep_response3 = 
"https://"+SUB_DOMAIN+".daruma.space/api/v1/departments?page="+"3"+"&per_page="+"100"+"&access_token="+ACCESS_TOKEN;
var dep_responseBody3 = UrlFetchApp.fetch(dep_response3).getContentText();
var dep_json3 = JSON.parse(dep_responseBody3);

var dep_json = [];

for (var dj1 = 0; dj1 < dep_json1.length; dj1++) {
  dep_json.push(dep_json1[dj1]);
}
for (var dj2 = 0; dj2 < dep_json2.length; dj2++) {
  dep_json.push(dep_json2[dj2]);
}
for (var dj3 = 0; dj3 < dep_json3.length; dj3++) {
  dep_json.push(dep_json3[dj3]);
}


/**
 * @param {array}   processed_data  加工配列データ
 * @param {string}   operation_type  業種
*/
// SHR従業員の取得し、更新
function callShrApi(processed_data,operation_type) {

  // 認証のためにアクセストークンの指定
  // HTTPリクエストヘッダー
  const headers = {
    'Authorization': 'Bearer ' + ACCESS_TOKEN // アクセストークンの設定
  }

  // HTTPリクエストのオプションを設定
  const params = {
    'method': 'GET',
    'headers': headers
  }

  //読み込んだ社員情報全件をフィルタや加工して一覧に追記する。
  for(var page=1;page<=LAST_PAGE;page++){
    // エンドポイントurl(環境に依存※開発環境)
    const endpointUrl = "https://"+SUB_DOMAIN+".daruma.space/api/v1/crews?page="+page+"&per_page="+PER_PAGE+"&access_token="+ACCESS_TOKEN;

    var response = UrlFetchApp.fetch(endpointUrl).getContentText();

    // jsonに変換
    var json = JSON.parse(response);


    // jsonをループして、社員番号に一致するものがあれば要素を追加して更新
    for (let i = 0; i < json.length; i++) {
        // 加工データの社員番号
        // 発令_現職本務
        if(operation_type == 3.1){
          var emp_code = processed_data[0]; // [0]→発令_現職本務の社員番号列
        }
        // 発令_所属
        if(operation_type == 3.3){
          var emp_code = processed_data[0]; // [0]→発令_現職本務の社員番号列
        }
        // 発令_通勤手当
        else if(operation_type == 3.2){
          var emp_code = processed_data[1]; // [1]→発令_通勤手当の社員番号列
        }
        // 標準報酬月額
        else if(operation_type == 4){
          var emp_code = processed_data[0]; // [0]→標準報酬月額の社員番号列
        }

      // API取得した社員番号
      var api_emp_code = json[i]['emp_code'];


      // 発令
      if(operation_type == 3.1 || operation_type == 3.2 || operation_type == 3.3){
        // 社員が一致していれば更新
        if(emp_code == api_emp_code){
          // SHR固有ID
          var id = json[i]['id'];
          updateShrEmployee(id,processed_data,operation_type);
        }
      }
      // 標準報酬月額
      else if(operation_type == 4){
        // 社員が一致していれば更新
        if(emp_code == api_emp_code){
          // SHR固有ID
          var id = json[i]['id'];
          updateShrEmployee(id,processed_data,operation_type);
        }
      }
    }
  }
}

/**
 * @param {integer}   id  SHR固有ID
 * @param {array}   processed_data  加工データ
 * @param {integer}   operation_type  業種
*/
// SHR従業員の更新
function updateShrEmployee(id,processed_data,operation_type) {
  const ACCESS_TOKEN = getProperties("ACCESS_TOKEN");
  const SUB_DOMAIN = getProperties("SUB_DOMAIN");
  const baseUrl = 'https://'+SUB_DOMAIN+'.daruma.space' // 環境に合わせて書き換えてください
  // 認証のためにアクセストークンの指定
  const headers = {
    'Authorization': 'Bearer ' + ACCESS_TOKEN // アクセストークンの設定
  }

  // 標準報酬月額のobject
  // 現職本務データの連携
  if(operation_type == 3.1){
    // 雇用形態のnameが一致するまでループし、employment_type_idを取得
    if(processed_data[17] != ""){
      for (let i = 0; i < emp_json.length; i++) {
        if(processed_data[17] == emp_json[i]['name']){
          processed_data[17] = emp_json[i]['id']
          break;
        }
      }
    }

    // カスタム（職種）のnameが一致するまでループし、項目名IDと選択肢IDを取得
    // カスタムJsonからグループ「職種」の配列を格納する
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '職種'){
        var bussiness_type_id = custom_json[i]['id']; // 項目名ID
        var bussiness_type_list = custom_json[i]['elements']; // 選択肢リスト
        break;
      }
    }
    // 項目（職種）の選択肢リストをループして選択肢IDを取得
    for (let i = 0; i <= bussiness_type_list.length; i++) {
      if(bussiness_type_list[i]['name'] == processed_data[9]){
        var bussiness_type_value_id = bussiness_type_list[i]['id']; // 選択肢ID
        break;
      }
    }
    if(typeof bussiness_type_value_id == "undefined"){
      var bussiness_type_value_id = '';
    }
        
    // カスタム（グレード）のnameが一致するまでループし、template_idを取得する
    // カスタムJsonからグループ「グレード」の配列を格納する
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == 'グレード'){
        var grade_id = custom_json[i]['id'];
        var grade_list = custom_json[i]['elements']; // 選択肢リスト
        break;
      }
    }
    // 項目（グレード）の選択肢リストをループして選択肢IDを取得
    for (let i = 0; i < grade_list.length; i++) {
      if(grade_list[i]['name'] == processed_data[7]){
        var grade_value_id = grade_list[i]['id']; // 選択肢ID
        break;
      }
    }
    if(typeof bussiness_type_value_id == "undefined"){
      var grade_value_id = '';
    }

    // カスタム（レベル）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == 'レベル'){
        var level_id = custom_json[i]['id'];
        break;
      }
    }
    if(typeof level_id == "undefined"){
      var level_id = '';
    }
    

    // カスタム（勤務地）のnameが一致するまでループし、template_idを取得する
    // カスタムJsonからグループ「勤務地」の配列を格納する
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '勤務地'){
        var bussiness_locate_id = custom_json[i]['id'];
        var bussiness_locate_list = custom_json[i]['elements']; // 選択肢リスト
        break;
      }
    }
    // 項目（勤務地）の選択肢リストをループして選択肢IDを取得
    for (let i = 0; i < bussiness_locate_list.length; i++) {
      if(bussiness_locate_list[i]['name'] == processed_data[15]){
        var bussiness_locate_value_id = bussiness_locate_list[i]['id']; // 選択肢ID
        break;
      }
    }
    if(typeof bussiness_locate_value_id == "undefined"){
      var bussiness_locate_value_id = '';
    }
    // 更新Json作成
    var payload = {
      'emp_code': processed_data[0], // 社員コード
      "employment_type_id": processed_data[17], // 雇用形態 社員区分
      'position': processed_data[13], // 役職
      // 部署
      "custom_fields": [
        // 職種
        {
          "template_id": bussiness_type_id,
          "value": bussiness_type_value_id,
        },
        // グレード
        {
          "template_id": grade_id,
          "value": grade_value_id,
        },
        // レベル
        {
          "template_id": level_id,
          "value": processed_data[11],
        },
        // 勤務地
        {
          "template_id": bussiness_locate_id,
          "value": bussiness_locate_value_id,
        },
      ]
    }
    var payload = JSON.stringify(payload);
  // 通勤手当データの連携
  } else if(operation_type == 3.2){

    // カスタム（通勤経路1_交通機関）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < custom_json.length; i++) {
      // 取得APIリストのnameがカスタム項目名と一致するか
      if(custom_json[i]['name'] == '通勤経路1_交通機関'){
        var traffic1_id = custom_json[i]['id']; // 項目名IDを宣言
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路2_交通機関'){
        var traffic2_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路3_交通機関'){
        var traffic3_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路4_交通機関'){
        var traffic4_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路1_（発）利用駅'){
        var departure1_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路2_（発）利用駅'){
        var departure2_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路3_（発）利用駅'){
        var departure3_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路4_（発）利用駅'){
        var departure4_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路1_（経由）利用駅'){
        var via1_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路2_（経由）利用駅'){
        var via2_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路3_（経由）利用駅'){
        var via3_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路4_（経由）利用駅'){
        var via4_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路1_（着）利用駅'){
        var arrival1_id = custom_json[i]['id'];
        break;
      }
    }
    if(typeof arrival1_id == "undefined"){
      var arrival1_id = '';
    }

    // カスタム（通勤経路.通勤経路2_（着）利用駅）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路2_（着）利用駅'){
        var arrival2_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路3_（着）利用駅'){
        var arrival3_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路4_（着）利用駅'){
        var arrival4_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路1_定期券金額'){
        var pass_amount1_id = custom_json[i]['id'];
        break;
      }
    }
    if(typeof pass_amount1_id == "undefined"){
      var pass_amount1_id = '';
    }

    // カスタム（通勤経路.通勤経路2_定期券金額）のnameが一致するまでループし、template_idを取得する
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路2_定期券金額'){
        var pass_amount2_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路3_定期券金額'){
        var pass_amount3_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路4_定期券金額'){
        var pass_amount4_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路1_備考'){
        var remarks1_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路2_備考'){
        var remarks2_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路3_備考'){
        var remarks3_id = custom_json[i]['id'];
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
    for (let i = 0; i < custom_json.length; i++) {
      if(custom_json[i]['name'] == '通勤経路4_備考'){
        var remarks4_id = custom_json[i]['id'];
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
    var payload = {
      // 部署
      "custom_fields": [
        // 通勤経路1_交通機関
        {
          "template_id": traffic1_id,
          "value": processed_data[18],
        },
        // 通勤経路2_交通機関
        {
          "template_id": traffic2_id,
          "value": processed_data[26],
        },
        // 通勤経路3_交通機関
        {
          "template_id": traffic3_id,
          "value": processed_data[27],
        },
        // 通勤経路4_交通機関
        {
          "template_id": traffic4_id,
          "value": processed_data[28],
        },
        // 通勤経路1_（発）利用駅
        {
          "template_id": departure1_id,
          "value": processed_data[19],
        },
        // 通勤経路2_（発）利用駅
        {
          "template_id": departure2_id,
          "value": processed_data[35],
        },
        // 通勤経路3_（発）利用駅
        {
          "template_id": departure3_id,
          "value": processed_data[38],
        },
        // 通勤経路4_（発）利用駅
        {
          "template_id": departure4_id,
          "value": processed_data[41],
        },
        // 通勤経路1_（経由）利用駅
        {
          "template_id": via1_id,
          "value": processed_data[20],
        },
        // 通勤経路2_（経由）利用駅
        {
          "template_id": via2_id,
          "value": processed_data[29],
        },
        // 通勤経路3_（経由）利用駅
        {
          "template_id": via3_id,
          "value": processed_data[30],
        },
        // 通勤経路4_（経由）利用駅
        {
          "template_id": via4_id,
          "value": processed_data[31],
        },
        // 通勤経路1_（着）利用駅
        {
          "template_id": arrival1_id,
          "value": processed_data[21],
        },
        // 通勤経路2_（着）利用駅
        {
          "template_id": arrival2_id,
          "value": processed_data[36],
        },
        // 通勤経路3_（着）利用駅
        {
          "template_id": arrival3_id,
          "value": processed_data[39],
        },
        // 通勤経路4_（着）利用駅
        {
          "template_id": arrival4_id,
          "value": processed_data[42],
        },
        // 通勤経路1_定期券金額
        {
          "template_id": pass_amount1_id,
          "value": processed_data[9],
        },
        // 通勤経路2_定期券金額
        {
          "template_id": pass_amount2_id,
          "value": processed_data[37],
        },
        // 通勤経路3_定期券金額
        {
          "template_id": pass_amount3_id,
          "value": processed_data[40],
        },
        // 通勤経路4_定期券金額
        {
          "template_id": pass_amount4_id,
          "value": processed_data[43],
        },
        // 通勤経路1_備考
        {
          "template_id": remarks1_id,
          "value": processed_data[22],
        },
        // 通勤経路2_備考
        {
          "template_id": remarks2_id,
          "value": processed_data[32],
        },
        // 通勤経路3_備考
        {
          "template_id": remarks3_id,
          "value": processed_data[33],
        },
        // 通勤経路4_備考
        {
          "template_id": remarks4_id,
          "value": processed_data[34],
        },
      ]
    }
    var payload = JSON.stringify(payload);
  } else if(operation_type == 3.3){
    // ループで各従業員の更新JSONを作成し、連結する
    // 現職本務データループ中に現職兼務をループして、兼務情報を取得
    // 兼務情報をループ
    let csv_sub_business = import_csv(operation_type = 3.3)
    let shr_kenmu_data = changeDataToSHR(csv_sub_business, operation_type = 3.3);
    var count = 0;
    labelIn:
    for (let n = 0; n < shr_kenmu_data.length; n++) {
      // 現職本務の1レコードと社員番号が一致するか、一致してたらカウント
      if(shr_kenmu_data[n][5] == ''){
        continue labelIn;
      }
      
      if(processed_data[0] == shr_kenmu_data[n][0] && count == 0){
        processed_data[24] = shr_kenmu_data[n][5]; // 兼務2
        count = count + 1;
      }
      else if(processed_data[0] == shr_kenmu_data[n][0] && count == 1){
        processed_data[25] = shr_kenmu_data[n][5]; // 兼務3
        count = count + 1;
      }
      else if(processed_data[0] == shr_kenmu_data[n][0] && count == 2){
        processed_data[26] = shr_kenmu_data[n][5]; // 兼務4
        count = count + 1;
      }
      else if(processed_data[0] == shr_kenmu_data[n][0] && count == 3){
        processed_data[27] = shr_kenmu_data[n][5]; // 兼務4
        count = count + 1;
        break;
      }
    }
    // 更新JSONを作成
    // 兼務情報が1つもない場合
    if(typeof(processed_data[24]) == "undefined"){
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[3] == dep_json[i]['name']){
          processed_data[3] = dep_json[i]['id']
          break;
        }
      }
      var count = 0;
    }
    
    // 兼務情報が1つの場合
    if(typeof(processed_data[24]) != "undefined" && typeof processed_data[25] == "undefined"){
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[3] == dep_json[i]['name']){
          processed_data[3] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[24] == dep_json[i]['name']){
          processed_data[24] = dep_json[i]['id']
          break;
        }
      }
      var count = 1;
    }

    // 兼務情報が2つの場合
    if(typeof(processed_data[24]) != "undefined" && typeof processed_data[25] != "undefined" && typeof processed_data[26] == "undefined"){
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[3] == dep_json[i]['name']){
          processed_data[3] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[24] == dep_json[i]['name']){
          processed_data[24] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[25] == dep_json[i]['name']){
          processed_data[25] = dep_json[i]['id']
          break;
        }
      }

      var count = 2;
    }

    // 兼務情報が3つの場合
    if(typeof(processed_data[24]) != "undefined" && typeof processed_data[25] != "undefined" && typeof processed_data[26] != "undefined" && typeof processed_data[27] == "undefined"){
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[3] == dep_json[i]['name']){
          processed_data[3] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[24] == dep_json[i]['name']){
          processed_data[24] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[25] == dep_json[i]['name']){
          processed_data[25] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[26] == dep_json[i]['name']){
          processed_data[26] = dep_json[i]['id']
          break;
        }
      }
      var count = 3;
    }

    // 兼務情報が4つの場合
    if(typeof(processed_data[24]) != "undefined" && typeof processed_data[25] != "undefined" && typeof processed_data[26] != "undefined" && typeof processed_data[27] != "undefined"){
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[3] == dep_json[i]['name']){
          processed_data[3] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[24] == dep_json[i]['name']){
          processed_data[24] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[25] == dep_json[i]['name']){
          processed_data[25] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[26] == dep_json[i]['name']){
          processed_data[26] = dep_json[i]['id']
          break;
        }
      }
      for (let i = 0; i < dep_json.length; i++) {
        if(processed_data[27] == dep_json[i]['name']){
          processed_data[27] = dep_json[i]['id']
          break;
        }
      }
      var count = 4;
    }

    if(count == 0){
      // 本務兼務のみ登録
      var payload = {
        'department_ids': [processed_data[3]] // 社員コード
      }
    } else if(count == 1) {
        // 兼務が1つの更新Json作成
        // 更新Json作成
        var payload = {
          'department_ids': [processed_data[3],processed_data[24]] // 社員コード
        }
    } else if(count == 2) {
        // 兼務が2つの更新Json作成
        // 更新Json作成
        var payload = {
          'department_ids': [processed_data[3],processed_data[24],processed_data[25]] // 社員コード
        }
    } else if(count == 3) {
        // 兼務が3つの更新Json作成
        // 更新Json作成
        var payload = {
          'department_ids': [processed_data[3],processed_data[24],processed_data[25],] // 社員コード
        }
        var payload = JSON.stringify(payload);
        // HTTPリクエストのオプションを設定
        const params = {
          'method': 'PATCH', // PATCHメソッドでリクスト
          "contentType" : "application/json",
          'headers': headers, // HTTPリクエストヘッダー
          'payload': payload // HTTPリクエストボディ(JSONパラメータ)
        }

        // 従業員部分更新APIにリクエストを送信
        const response = UrlFetchApp.fetch(baseUrl + '/api/v1/crews/' + id, params)

        // レスポンスボディを取得
        const responseBody = response.getContentText()
        const json = JSON.parse(responseBody)

        // 二回に分けて送信
        var payload = {
          'department_ids': [processed_data[26]] // 社員コード
        }
        var payload = JSON.stringify(payload);

        // 従業員部分更新APIにリクエストを送信
        const response2 = UrlFetchApp.fetch(baseUrl + '/api/v1/crews/' + id, params)

        // レスポンスボディを取得
        const responseBody2 = response2.getContentText();
        const json2 = JSON.parse(responseBody2);
        return;
    } else if(count == 4) {
        // 兼務が3つの更新Json作成
        // 更新Json作成
        var payload = {
          'department_ids': [processed_data[3],processed_data[24],processed_data[25]] // 社員コード
        }
        var payload = JSON.stringify(payload);
        // HTTPリクエストのオプションを設定
        const params = {
          'method': 'PATCH', // PATCHメソッドでリクスト
          "contentType" : "application/json",
          'headers': headers, // HTTPリクエストヘッダー
          'payload': payload // HTTPリクエストボディ(JSONパラメータ)
        }

        // 従業員部分更新APIにリクエストを送信
        const response = UrlFetchApp.fetch(baseUrl + '/api/v1/crews/' + id, params)

        // レスポンスボディを取得
        const responseBody = response.getContentText()
        const json = JSON.parse(responseBody)

        // 二回に分けて送信
        var payload = {
          'department_ids': [processed_data[26],processed_data[27]] // 社員コード
        }
        var payload = JSON.stringify(payload);

        // 従業員部分更新APIにリクエストを送信
        const response2 = UrlFetchApp.fetch(baseUrl + '/api/v1/crews/' + id, params)

        // レスポンスボディを取得
        const responseBody2 = response2.getContentText()
        const json2 = JSON.parse(responseBody2)
        return;
    }
    var payload = JSON.stringify(payload);
  } else if(operation_type == 4){
    var payload = {
      'emp_code': processed_data[0], // 社員コード
      'monthly_standard_income_hel': processed_data[1], // 健康保険の標準報酬月額
      'monthly_standard_income_updated_at': processed_data[2], // 標準報酬月額の改定年月
      'monthly_standard_income_pns': processed_data[3], // 厚生年金の標準報酬月額
    }
    var payload = JSON.stringify(payload);
  }

  // HTTPリクエストのオプションを設定
  const params = {
    'method': 'PATCH', // PATCHメソッドでリクスト
    "contentType" : "application/json",
    'headers': headers, // HTTPリクエストヘッダー
    'payload': payload // HTTPリクエストボディ(JSONパラメータ)
  }

  // 従業員部分更新APIにリクエストを送信
  const response = UrlFetchApp.fetch(baseUrl + '/api/v1/crews/' + id, params)

  // fetch()からはHTTPResponseオブジェクト型の値が返却される
  // ここではresponseという変数に格納しています

  // レスポンスボディを取得
  const responseBody = response.getContentText()
  const json = JSON.parse(responseBody)
}

/**
 * SmartHR_API "従業員-リストの取得"にリクエストを送信し、
 * 更新日時の降順でソートし、履歴データ出力のための元データとして1000人分の社員情報を取得する
 * 
 * return [array] employeeList
 */
function callShrEmployeeListApi() {
  // SmartHR_API 環境値
  const AccessToken = getProperties("ACCESS_TOKEN");  //smartHRのアクセストークン
  const SubDomain = getProperties("SUB_DOMAIN");  //smartHRのサブドメイン

  // 1000人分取得するためのAPIオプション値
  const pageCount = 10;
  const getCount = 100;

  // HTTPリクエストヘッダーの作成
  const headers = {
    //アクセストークンの設定
    'Authorization': 'Bearer ' + AccessToken
  }

  // HTTPリクエストのオプションの設定
  const params = {
    'method': 'GET',  //GETメソッドでリクエスト
    'headers' : headers  //HTTPリクエストヘッダー
  }

  var employeeList = [];

  // SmartHR_API 従業員_"リストの取得"にリクエストを送信しレスポンスを取得
  for (var page = 1; page <= pageCount; page++) {
    const response = UrlFetchApp.fetch('https://' + SubDomain + '.daruma.space/api/v1/crews?sort=-updated_at&page=' + page + '&per_page=' + getCount, params);

    // レスポンスを文字列で取得
    const responseBody = response.getContentText();
    // jsonオブジェクトに変換
    const json = JSON.parse(responseBody);

    if (json.length > 0) {
      for (var employeeCount = 0; employeeCount < json.length; employeeCount++) {
        employeeList.push(json[employeeCount]);
      }
    }
  }

  return employeeList;
}

/**
 * 対象の従業員に登録されている家族情報を取得する
 * 
 * @param {string}   id  従業員ID
 * 
 * return json
*/
function callShrFamilyApi(id) {
  const ACCESS_TOKEN = getProperties("ACCESS_TOKEN");
  const SUB_DOMAIN = getProperties("SUB_DOMAIN");
  const baseUrl = 'https://'+SUB_DOMAIN+'.daruma.space' // 環境に合わせて書き換えてください

  // 認証のためにアクセストークンの指定
  const headers = {
    'Authorization': 'Bearer ' + ACCESS_TOKEN // アクセストークンの設定
  }

  // HTTPリクエストのオプションを設定
  const params = {
    'method': 'GET', // PATCHメソッドでリクスト
    "contentType" : "application/json",
    'headers': headers, // HTTPリクエストヘッダー
  }

  // 家族情報APIにリクエストを送信
  const response = UrlFetchApp.fetch(baseUrl + '/api/v1/crews/' + id + '/dependents?page=1&per_page=10', params)

  // レスポンスボディを取得
  const responseBody = response.getContentText()

  // jsonオブジェクトに変換
  const json = JSON.parse(responseBody)

  return json
}