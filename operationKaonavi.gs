// カオナビから取得したアクセストークン情報一式を返す
function getToken() {
  const consumerKey = getProperties("localConsumerKey");;        //指定のconsumerKey
  const consumerSecret = getProperties("localConsumerSecret");;  //指定のcunsumerSecret

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
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/tasks/9160';

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
  console.log(sheets_id);
  var apiUrl = `https://api.kaonavi.jp/api/v2.0/sheets/${sheets_id}`;
  
  var payload = {}; // 連想配列宣言
  // 更新Json作成
  var payload = {}; // 連想配列宣言
  var str_payload = `{"member_data":[${member_data}]}`;　// 連想配列に変数を代入すると変数が文字列として認識してしまう為、文字列型の連想配列を宣言

  payload = str_payload;　// 連想配列にstr_payloadを代入
  

  payload = JSON.stringify(payload);
  payload = JSON.parse(payload);

  console.log(payload);

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

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();
  console.log('response = '+ response, 'e'); // レスポンスをログに出力
  log('response = '+ response, 'e'); // レスポンスをログに出力
}