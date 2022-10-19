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
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/tasks/8870';

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
 * カオナビの基本情報シートの更新
 */
function kaonaviUpdateApi(member_data) {

  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/members';


  // 更新Json作成
  // ToDo連想配列の中に連想配列を入れようとしているが、シングルクォートが入ってしまい、カオナビのリクエストボディにならない
  var payload = {
    "member_data": [{}]
  }

  payload["member_data"] = member_data;

  payload = JSON.stringify(payload);
  payload = JSON.parse(payload);

  // console.log(typeof(payload));
  // console.log(payload);

  payload = JSON.parse(JSON.stringify(payload));
  // payload = payload.replace("'", "");

  // console.log(typeof(payload));

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    payload: payload,
    method: 'patch',
    muteHttpExceptions : true,
  };

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();

  let json = JSON.parse(response);
  console.log(json);
  return json;
}