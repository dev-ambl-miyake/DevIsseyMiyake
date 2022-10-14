
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
        // 標準報酬月額
        else if(operation_type == 4){
          var emp_code = processed_data[0]; // [0]→標準報酬月額の社員番号列
        }

      // API取得した社員番号
      var api_emp_code = json[i]['emp_code'];


      // 標準報酬月額
      if(operation_type == 3.1){
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
  if(operation_type == 3.1){
    // 雇用形態のnameが一致するまでループし、employment_type_idを取得
    if(processed_data[16] != ""){
      for (let i = 0; i < emp_json.length; i++) {
        if(processed_data[16] == emp_json[i]['name']){
          processed_data[16] = emp_json[i]['id']
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
      if(bussiness_type_list[i]['name'] == processed_data[8]){
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
      if(grade_list[i]['name'] == processed_data[6]){
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
      if(bussiness_locate_list[i]['name'] == processed_data[14]){
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
      "employment_type_id": processed_data[16], // 雇用形態 社員区分
      'position': processed_data[12], // 役職
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
          "value": processed_data[10],
        },
        // 勤務地
        {
          "template_id": bussiness_locate_id,
          "value": bussiness_locate_value_id,
        },
      ]
    }
    var payload = JSON.stringify(payload);
  } else if(operation_type == 4){
    if(processed_data[4] != ''){
      // 氏名が空じゃないのであれば姓、名も送る
      var payload = {
        'emp_code': processed_data[0], // 社員コード
        'monthly_standard_income_hel': processed_data[1], // 健康保険の標準報酬月額
        'monthly_standard_income_updated_at': processed_data[2], // 標準報酬月額の改定年月
        'monthly_standard_income_pns': processed_data[3], // 厚生年金の標準報酬月額
        'last_name': processed_data[5], // 姓
        'first_name': processed_data[6], // 名
      }
    }else{
      var payload = {
        'emp_code': processed_data[0], // 社員コード
        'monthly_standard_income_hel': processed_data[1], // 健康保険の標準報酬月額
        'monthly_standard_income_updated_at': processed_data[2], // 標準報酬月額の改定年月
        'monthly_standard_income_pns': processed_data[3], // 厚生年金の標準報酬月額
      }
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
 * @param {strint}   id  従業員ID
 * @param {string}   operation_type  業種
*/
// 対象の従業員に登録されている家族情報を取得する
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

  // fetch()からはHTTPResponseオブジェクト型の値が返却される
  // ここではresponseという変数に格納しています

  // レスポンスボディを取得
  const responseBody = response.getContentText()
  const json = JSON.parse(responseBody)

  return json
}