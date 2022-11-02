// 取得APIを取得
const employees_api = kaonaviMemberApi(); // カオナビの全従業員情報API
const member_list = employees_api['member_data']; // カオナビの全従業員情報リスト

const department_api = kaonaviDepartmentApi(); // カオナビの所属ツリーAPI
const department_list = department_api['department_data']; // カオナビの所属ツリーAPI

const member_sheets_api = kaonaviMemberSheetsApi(); // カオナビの基本情報シート情報
const member_custom_list = member_sheets_api['custom_fields']; // カオナビの基本情報シートカスタム項目リスト

const sheets_api = kaonaviSheetsApi(); // カオナビの全シート情報
const sheets_list = sheets_api['sheets']; // カオナビの全シート情報


// カオナビから取得したアクセストークン情報一式を返す
function getToken() {
  const consumerKey = getProperties("localConsumerKey");        //指定のconsumerKey
  const consumerSecret = getProperties("localConsumerSecret");  //指定のcunsumerSecret

  const credentials = Utilities.base64Encode(`${consumerKey}:${consumerSecret}`, Utilities.Charset.UTF_8);

  //カオナビAPIを叩くのに必要なデータ
  const options = {
    'method' : 'post',
    'headers' : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization' : `Basic ${credentials}`,
    },
    'payload' : 'grant_type=client_credentials'
  };

  //取得したデータをjsonとして解析
  const jsonData = JSON.parse(
    UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/token', options).getContentText()
  );

  //カオナビから取得したトークン情報一式を返す
  return jsonData;
}

/**
 * カオナビの全従業員データの取得
 */
function kaonaviMemberApi() {

  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/members';

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    method : 'get'
  };

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();

  let json = JSON.parse(response);
  return json;
}

/**
 * カオナビの所属ツリーデータの取得
 */
function kaonaviDepartmentApi() {

  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/departments';

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    method : 'get'
  };

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();

  let json = JSON.parse(response);
  return json;
}

/**
 * カオナビの基本情報シート情報の取得
 */
function kaonaviMemberSheetsApi() {

  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/member_layouts';

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    method : 'get'
  };

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();

  let json = JSON.parse(response);

  return json;
}

/**
 * カオナビの全シート情報の取得
 */
function kaonaviSheetsApi() {

  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/sheet_layouts';

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    method : 'get'
  };

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();

  let json = JSON.parse(response);
  return json;
}

/**
 * カオナビのタスク状況の取得
 */
function kaonaviTaskApi() {

  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/tasks/10564';

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    method : 'get'
  };

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();
  let json = JSON.parse(response);
  console.log(json);
  return json;
}

/**
 * カオナビメンバーの基本情報シートの更新
 * @param {jsonstring} member_data 連想配列をjson文字列に変換した値
 */
function kaonaviUpdateApi(member_data) {
  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/members';
  
  // 更新Json作成
  var payload = {}; // 連想配列宣言
  var str_payload = `{"member_data":[${member_data}]}`;　// 連想配列に変数を代入すると変数が文字列として認識してしまう為、文字列型の連想配列を宣言

  payload = str_payload;　// 連想配列にstr_payloadを代入
  

  payload = JSON.stringify(payload);
  payload = JSON.parse(payload);

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    payload: payload,
    method: 'patch', // 部分更新
    muteHttpExceptions : true,
  };


  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();
  log('response = '+ response, 'e'); // レスポンスをログに出力
}

/**
 * カオナビメンバーのシート情報更新
 * @param {string} sheet_id シートID
 * @param {jsonstring} member_data 連想配列をjson文字列に変換した値
 */
function kaonaviSheetsUpdateApi(sheets_id,member_data) {

  const token = getToken();
  var apiUrl = `https://api.kaonavi.jp/api/v2.0/sheets/${sheets_id}`;
  
  var payload = {}; // 連想配列宣言
  // 更新Json作成
  var payload = {}; // 連想配列宣言
  var str_payload = `{"member_data":[${member_data}]}`;　// 連想配列に変数を代入すると変数が文字列として認識してしまう為、文字列型の連想配列を宣言

  payload = str_payload;　// 連想配列にstr_payloadを代入
  

  payload = JSON.stringify(payload);
  payload = JSON.parse(payload);


  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    payload: payload,
    method: 'patch', // 一括更新
    muteHttpExceptions : true,
  };
  console.log(payload);

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();
  log('response = '+ response, 'e'); // レスポンスをログに出力
  console.log('response = '+ response);
}

/**
 * カオナビのシートIDを取得する
 * @param {string} sheets_name  シート名
 * @return {string} sheets_id カオナビシートID
 */
function matchSheets(sheets_name) {
  // カオナビの全従業員情報jsonをループ
  for (let i = 0; i < sheets_list.length; i++) {
    if(sheets_name == sheets_list[i]['name']){
      // カオナビ固有ID
      var sheets_id = sheets_list[i]['id'];
      break;
    }
  }
  if(typeof sheets_id == "undefined"){
    throw new Error("カオナビに該当のシートIDが見つかりませんでした。");
  }
  return sheets_id;
}