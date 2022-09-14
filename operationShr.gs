/**
 * @param {array}   processed_data  加工配列データ
 * @param {string}   operation_type  業種
*/
// SHR従業員の取得し、更新
function callShrApi(processed_data,operation_type) {

  //何ページ分取得するか（登録されている社員数に依存する）
  const LAST_PAGE = 2;
  //1ページ最大100件まで
  const PER_PAGE = 100;

  const ACCESS_TOKEN = getProperties("ACCESS_TOKEN");
  const SUB_DOMAIN = getProperties("SUB_DOMAIN");

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
      var emp_code = processed_data[0]; // [0]→標準報酬月額の社員番号列

      // API取得した社員番号
      var api_emp_code = json[i]['emp_code'];

      // 標準報酬月額
      if(operation_type == 4){
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

  // HTTPリクエストボディを作ります
  // API仕様ではJSON形式で送ってね、ということでしたが、objectで作って送る。

  // 標準報酬月額のobject
  if(operation_type == 4){
    var payload = {
      'emp_code': processed_data[0], // 社員コード
      'monthly_standard_income_hel': processed_data[1], // 健康保険の標準報酬月額
      'hel_ins_insured_person_number': processed_data[2], // 健康保険の被保険者整理番号
      'monthly_standard_income_pns': processed_data[3], // 厚生年金の標準報酬月額
      'soc_ins_insured_person_number': processed_data[4], // 厚生年金保険の被保険者整理番号
      'basic_pension_number': processed_data[5], // 基礎年金番号
      'soc_ins_qualified_at': '2017/10/29', // 社会保険の資格取得年月日
      'soc_ins_disqualified_at': '2017/10/29', // 社会保険の資格喪失年月日
      'monthly_standard_income_updated_at': '2017/10/29', // 標準報酬月額の改定年月
      'monthly_income_currency': '10000', // 報酬月額（通貨）
      'monthly_income_goods': '20000', // 報酬月額（現物）
    }
  }

  // HTTPリクエストのオプションを設定
  const params = {
    'method': 'PATCH', // PATCHメソッドでリクスト
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