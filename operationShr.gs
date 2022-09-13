// SHR従業員の取得
function callShrApi() {

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

  // 従業員リスト取得APIにリクエストを送信
  const response = UrlFetchApp.fetch('https://'+SUB_DOMAIN+'.daruma.space/api/v1/crews', params)

  // レスポンスボディを文字列で取得
  const responseBody = response.getContentText()

  // ログ出力して文字列型になっているか確認
  console.log(typeof(responseBody))

  // JSON.parse()に変換
  const json = JSON.parse(responseBody)
  // ログ出力してオブジェクトになっているか確認
  console.log(typeof(json))
  
  // どんなレスポンスが返却されるか確認
  console.log(json)
}

// SHR従業員の更新
function updateShrEmployee() {
  const ACCESS_TOKEN = getProperties("ACCESS_TOKEN");
  const SUB_DOMAIN = getProperties("SUB_DOMAIN");
  const baseUrl = 'https://'+SUB_DOMAIN+'.daruma.space' // 環境に合わせて書き換えてください

  // 認証のためにアクセストークンの指定
  const headers = {
    'Authorization': 'Bearer ' + ACCESS_TOKEN // アクセストークンの設定
  }

  // HTTPリクエストボディを作ります
  // API仕様ではJSON形式で送ってね、ということでしたが、objectで作って送ります。
  const payload = {
    'emp_code': '00012', // 社員コード
    'soc_ins_insured_person_number': '4363', // 厚生年金保険の被保険者整理番号
    'hel_ins_insured_person_number': '4363', // 健康保険の被保険者整理番号
    'basic_pension_number': '2111-056370', // 基礎年金番号
    'soc_ins_qualified_at': '2017/10/29', // 社会保険の資格取得年月日
    'soc_ins_disqualified_at': '2017/10/29', // 社会保険の資格喪失年月日
    'monthly_standard_income_updated_at': '2017/10/29', // 標準報酬月額の改定年月
    'monthly_income_currency': '10000', // 報酬月額（通貨）
    'monthly_income_goods': '20000', // 報酬月額（現物）
    'monthly_standard_income_hel': '30000', // 健康保険の標準報酬月額
    'monthly_standard_income_pns': '40000', // 厚生年金の標準報酬月額

  }  

  // HTTPリクエストのオプションを設定
  const params = {
    'method': 'PATCH', // PATCHメソッドでリクスト
    'headers': headers, // HTTPリクエストヘッダー
    'payload': payload // HTTPリクエストボディ(JSONパラメータ)
  }

  // 従業員部分更新APIにリクエストを送信
  const id = '02f54e39-c1de-4e68-b84a-4f2ada5af5c4' // 対象の従業員idに変えてください
  const response = UrlFetchApp.fetch(baseUrl + '/api/v1/crews/' + id, params)

  // fetch()からはHTTPResponseオブジェクト型の値が返却される
  // ここではresponseという変数に格納しています

  // レスポンスボディを取得
  const responseBody = response.getContentText()
  const json = JSON.parse(responseBody)

  // レスポンスには更新された従業員の情報が返却される
  // 従業員の情報が変更されているかを確認
  console.log(json.first_name)
  console.log(json.first_name_yomi)
  console.log(json.gender)
}