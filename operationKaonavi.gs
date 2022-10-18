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