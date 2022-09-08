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