/**
 * 入社_SmartHRからカオナビへの社員情報連携登録処理
 * 
 * 社員番号入力_スプレッドシートに入力された社員番号と、
 * 履歴データ[登録用]_スプレッドシートに記載されている社員番号を照合し、
 * 一致した社員情報をSmartHR_APIより取得しカオナビへ登録する
 */
function createMember() {
  // 開始ログ
  log('入社_カオナビ連携登録', 's');

  const employeeIdList = createIdList();
  if(!employeeIdList) {
    return
  }

  const memberData = createEmployeeList(employeeIdList);

  // カオナビAPI_トークン取得
  const token = getToken();
  let dataList = [];

  // データ格納用配列変数
  let basicInfoList = [];  // 基本情報
  let contactList = [];  // 連絡先
  let addressList = [];  // 住所
  let emergencyContactList = [];  // 緊急連絡先
  let bankList = [];  // 銀行口座
  let academicList = [];  // 学歴
  let languageList = [];  // 語学
  let licenseList = [];  // 免許・資格等
  let familyList = [];  // 家族情報

  try{
    // 登録対象の社員人数分ループ参照
    for(var l = 0; l < memberData.length; l++) {
      /* 基本情報 */
      let basicInfo = {
        // 社員番号
        // 氏名
        // フリガナ
        // 入社日
        // 性別
        // 生年月日
        // 採用形態
      }

      /* 連絡先 */
      let contact = {
        // メールアドレス
        // 電話番号
      }

      /* 現住所シート */
      let address = {
        // 現住所（郵便番号）
        // 現住所（都道府県）
        // 現住所（市区町村）
        // 現住所（丁目・番地）
        // 現住所（建物名・部屋番号）
        // 現住所（国コード）
      }

      /* 緊急連絡先 */
      let emergencyContact = {
        // 緊急連絡先の続柄
        // 緊急連絡先の氏名
        // 緊急連絡先のフリガナ
        // 緊急連絡先の電話番号
        // 緊急連絡先の郵便番号
        // 緊急連絡先の都道府県
        // 緊急連絡先の市区町村
        // 緊急連絡先の丁目・番地
        // 緊急連絡先の建物名・部屋番号
      }

      /* 銀行口座 */
      let bank = {
        // 銀行コード
        // 支店コード
        // 預金種別
        // 口座番号
        // 名義（カタカナ）
      }

      /* 学歴 */
      let academic = {
        // 学校1_学校分類
        // 学校1_学校名
        // 学校1_入学年月日
        // 学校1_卒業・中退年月日
        // 学校1_卒業・中退
        // 学校1_学部・学科・コース名
        // 学校1_専攻科目ジャンル
        // 学校2_学校分類
        // 学校2_学校名
        // 学校2_入学年月日
        // 学校2_卒業・中退年月日
        // 学校2_卒業・中退
        // 学校2_学部・学科・コース名
        // 学校2_専攻科目ジャンル
        // 学校3_学校分類
        // 学校3_学校名
        // 学校3_入学年月日
        // 学校3_卒業・中退年月日
        // 学校3_卒業・中退
        // 学校3_学部・学科・コース名
        // 学校3_専攻科目ジャンル
        // 学校4_学校分類
        // 学校4_学校名
        // 学校4_入学年月日
        // 学校4_卒業・中退年月日
        // 学校4_卒業・中退
        // 学校4_学部・学科・コース名
        // 学校4_専攻科目ジャンル
        // 学校5_学校分類
        // 学校5_学校名
        // 学校5_入学年月日
        // 学校5_卒業・中退年月日
        // 学校5_卒業・中退
        // 学校5_学部・学科・コース名
        // 学校5_専攻科目ジャンル
      }

      /* 語学 */
      let language = {
        // 英語（社内テスト）_テスト名
        // 英語（社内テスト）_スコア
        // 英語（社内テスト）_受験日
        // 英語_試験名
        // 英語_スコア
        // 英語_取得年月日
        // その他外国語①_語学名
        // その他外国語①_級・スコア等
        // その他外国語①_取得年月日
        // その他外国語②_語学名
        // その他外国語②_級・スコア等
        // その他外国語②_取得年月日
      }

      /* 免許・資格等 */
      let license = {
        // 免許名・資格名①
        // 免許・資格.取得年月日①
        // 免許名・資格名②
        // 免許・資格.取得年月日②
      }

      /* 家族情報 */
      let family = {
        // 家族1 続柄
        // 家族1 姓
        // 家族1 名
        // 家族1 姓（ヨミガナ）
        // 家族1 名（ヨミガナ）
        // 家族1 生年月日
        // 家族1 性別
        // 家族1 職業
        // 家族1 同居・別居の別
        // 家族1 住所（郵便番号）
        // 家族1 住所（都道府県）
        // 家族1 住所（市区町村）
        // 家族1 住所（丁目・番地）
        // 家族1 住所（建物名・部屋番号）
        // 家族1 電話番号

        // 家族2 続柄
        // 家族2 姓
        // 家族2 名
        // 家族2 姓（ヨミガナ）
        // 家族2 名（ヨミガナ）
        // 家族2 生年月日
        // 家族2 性別
        // 家族2 職業
        // 家族2 同居・別居の別
        // 家族2 住所（郵便番号）
        // 家族2 住所（都道府県）
        // 家族2 住所（市区町村）
        // 家族2 住所（丁目・番地）
        // 家族2 住所（建物名・部屋番号）
        // 家族2 電話番号

        // 家族3 続柄
        // 家族3 姓
        // 家族3 名
        // 家族3 姓（ヨミガナ）
        // 家族3 名（ヨミガナ）
        // 家族3 生年月日
        // 家族3 性別
        // 家族3 職業
        // 家族3 同居・別居の別
        // 家族3 住所（郵便番号）
        // 家族3 住所（都道府県）
        // 家族3 住所（市区町村）
        // 家族3 住所（丁目・番地）
        // 家族3 住所（建物名・部屋番号）
        // 家族3 電話番号

        // 家族4 続柄
        // 家族4 姓
        // 家族4 名
        // 家族4 姓（ヨミガナ）
        // 家族4 名（ヨミガナ）
        // 家族4 生年月日
        // 家族4 性別
        // 家族4 職業
        // 家族4 同居・別居の別
        // 家族4 住所（郵便番号）
        // 家族4 住所（都道府県）
        // 家族4 住所（市区町村）
        // 家族4 住所（丁目・番地）
        // 家族4 住所（建物名・部屋番号）
        // 家族4 電話番号

        // 家族5 続柄
        // 家族5 姓
        // 家族5 名
        // 家族5 姓（ヨミガナ）
        // 家族5 名（ヨミガナ）
        // 家族5 生年月日
        // 家族5 性別
        // 家族5 職業
        // 家族5 同居・別居の別
        // 家族5 住所（郵便番号）
        // 家族5 住所（都道府県）
        // 家族5 住所（市区町村）
        // 家族5 住所（丁目・番地）
        // 家族5 住所（建物名・部屋番号）
        // 家族5 電話番号

        // 家族6 続柄
        // 家族6 姓
        // 家族6 名
        // 家族6 姓（ヨミガナ）
        // 家族6 名（ヨミガナ）
        // 家族6 生年月日
        // 家族6 性別
        // 家族6 職業
        // 家族6 同居・別居の別
        // 家族6 住所（郵便番号）
        // 家族6 住所（都道府県）
        // 家族6 住所（市区町村）
        // 家族6 住所（丁目・番地）
        // 家族6 住所（建物名・部屋番号）
        // 家族6 電話番号

        // 家族7 続柄
        // 家族7 姓
        // 家族7 名
        // 家族7 姓（ヨミガナ）
        // 家族7 名（ヨミガナ）
        // 家族7 生年月日
        // 家族7 性別
        // 家族7 職業
        // 家族7 同居・別居の別
        // 家族7 住所（郵便番号）
        // 家族7 住所（都道府県）
        // 家族7 住所（市区町村）
        // 家族7 住所（丁目・番地）
        // 家族7 住所（建物名・部屋番号）
        // 家族7 電話番号

        // 家族8 続柄
        // 家族8 姓
        // 家族8 名
        // 家族8 姓（ヨミガナ）
        // 家族8 名（ヨミガナ）
        // 家族8 生年月日
        // 家族8 性別
        // 家族8 職業
        // 家族8 同居・別居の別
        // 家族8 住所（郵便番号）
        // 家族8 住所（都道府県）
        // 家族8 住所（市区町村）
        // 家族8 住所（丁目・番地）
        // 家族8 住所（建物名・部屋番号）
        // 家族8 電話番号

        // 家族9 続柄
        // 家族9 姓
        // 家族9 名
        // 家族9 姓（ヨミガナ）
        // 家族9 名（ヨミガナ）
        // 家族9 生年月日
        // 家族9 性別
        // 家族9 職業
        // 家族9 同居・別居の別
        // 家族9 住所（郵便番号）
        // 家族9 住所（都道府県）
        // 家族9 住所（市区町村）
        // 家族9 住所（丁目・番地）
        // 家族9 住所（建物名・部屋番号）
        // 家族9 電話番号

        // 家族10 続柄
        // 家族10 姓
        // 家族10 名
        // 家族10 姓（ヨミガナ）
        // 家族10 名（ヨミガナ）
        // 家族10 生年月日
        // 家族10 性別
        // 家族10 職業
        // 家族10 同居・別居の別
        // 家族10 住所（郵便番号）
        // 家族10 住所（都道府県）
        // 家族10 住所（市区町村）
        // 家族10 住所（丁目・番地）
        // 家族10 住所（建物名・部屋番号）
        // 家族10 電話番号
      }

      basicInfoList.push(basicInfo);
      contactList.push(contact);
      addressList.push(address);
      emergencyContactList.push(emergencyContact);
      bankList.push(bank);
      academicList.push(academic);
      languageList.push(language);
      licenseList.push(license);
      familyList.push(family);
    }

    let member_data = {
      "member_data" : dataList
    }

    let apiOptions = {
      'headers' : {
        'Kaonavi-Token' : token["access_token"],
        'Content-Type': 'application/json'
      },
      'payload': JSON.stringify(member_data),
      'method': 'post',
      'muteHttpExceptions' : false
    }
  
    UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/members', apiOptions);

    // 終了ログ
  　log('入社_カオナビ連携登録', 'e');

    SpreadsheetApp.getUi().alert("カオナビへの社員情報登録が終了しました。");

  }catch(e) {
    SpreadsheetApp.getUi().alert("カオナビへの社員情報登録に失敗しました。\n入力した社員番号が誤っている、もしくは既に登録されています。");
  }
}

// 社員番号を照合し、連携登録対象の社員ID一覧データ配列を生成する
function createIdList() {
  try{
    // 社員番号入力_スプレッドシートに入力された従業員番号を取得する
    let ss = SpreadsheetApp.getActive();
    let sheet = ss.getActiveSheet();
    let lastRow = sheet.getLastRow();  //最終行を取得
    const inputHeaderLine = 8; //社員番号入力するまでの見出しの行数
  
    // 履歴データ[登録用]から入力された従業員番号のidを取得する
    let idList = [];  //空のリストを作成
    let logss = SpreadsheetApp.openById(getProperties("storeHistorySpreadsheetsId"));
    let logSheet = logss.getSheets()[0];
    let logSheetLastRow = logSheet.getLastRow();
    const logDate = logSheet.getRange(2,1,logSheetLastRow -1,4).getValues();  //履歴データ新規からデータを取得
    

    // 社員番号が入力されている場合のみ実行
    if(lastRow > inputHeaderLine) {
      // 入力された社員番号を取得
      let employeeNumber = sheet.getRange(9,2,lastRow - inputHeaderLine,1).getValues();

      // 取得した社員番号分繰り返し実行
      for(var i = 0; i < employeeNumber.length; i++) {
        for(var j = 0; j < logDate.length; j++) {
          // 履歴データ新規の中に、入力した社員番号が存在するか
          if(logDate[j].includes(String(employeeNumber[i]))) {
            // 存在した場合、リストにidを追加する
            idList.push(logDate[j][3]);
          }
        }
      }
      // 入力された社員番号数と取得出来た社員番号数が一致しない　もしくは　全て間違って入力している
      if(idList.length !== employeeNumber.length || idList.length === 0) {
        SpreadsheetApp.getUi().alert("誤った社員番号が入力されています。");
        return false
      }
      
      return idList
    }
    SpreadsheetApp.getUi().alert("社員番号が入力されていません。");
    return false

  } catch(e) {
    SpreadsheetApp.getUi().alert("履歴データからのデータ取得に失敗しました。");
  }
}

// SmartHR_APIより社員IDを用いて社員情報を取得し、社員情報一覧配列データを生成する
function createEmployeeList(idList) {
    // SmartHR_API 環境値
    const AccessToken = getProperties("ACCESS_TOKEN")  //smartHRのアクセストークン
    const SubDomain = getProperties("SUB_DOMAIN")  //smartHRのサブドメイン

  //HTTPリクエストヘッダーの作成
  const headers = {
    //アクセストークンの設定
    'Authorization': 'Bearer ' + AccessToken
  }

  //HTTPリクエストのオプションの設定
  const params = {
    'method': 'GET',  //GETメソッドでリクエスト
    'headers' : headers  //HTTPリクエストヘッダー
  }
  let responseList = [];

  try{
    for(var k = 0; k < idList.length; k++) {
      // SmartHR_API 従業員_"取得"にリクエストを送信しレスポンスを取得
      const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[k], params)
      // レスポンスを文字列で取得
      const responseBody = response.getContentText()
      // jsonオブジェクトに変換
      const json = JSON.parse(responseBody)

      responseList.push(json);
    }

    return responseList;

  } catch(e) {
    SpreadsheetApp.getUi().alert("smartHRからのデータ取得に失敗しました。");
  }
}
