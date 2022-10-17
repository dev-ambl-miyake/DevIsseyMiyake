/**
 * 入社_SmartHRからOBICへの社員情報連携登録処理
 * 
 * 社員番号入力_スプレッドシートに入力された社員番号と、
 * 履歴データ[登録用]_スプレッドシートに記載されている社員番号を照合し、
 * 一致した社員情報をSmartHR_APIより取得しOBIC取り込み用CSVファイルとして出力する
 */
function createCSV() {
  try {
    // 開始ログ
    log('入社_OBIC連携登録', 's');

    const employeeIdList = createIdList();
    if(!employeeIdList) {
      return
    }

    const memberData = createEmployeeList(employeeIdList);

    let baseDataList = [];
    let addressDataList = [];
    let familyDataList = [];
    let taxDataList = [];

    // 連携登録対象の人数分、各CSVファイルを出力
    for(var l = 0; l < memberData.length; l++) {

      // SmartHR_API 家族情報_"リストの取得"にリクエストを送信しレスポンスを取得
      let familyApiData = callShrFamilyApi(memberData[l]['id']);

      // 加工が必要な項目
      /* 社員基本 */
      // 氏名カナ
      var nameKana = zenkana2Hankana(memberData[l]['last_name_yomi'] + " " + memberData[l]['first_name_yomi']);
      // 呼称適用
      if (memberData[l]['business_last_name'] && memberData[l]['business_first_name']) {
        var naming = 1;
      } else {
        var naming = 0;
      }
      // 旧氏名カナ
      var businessNameKana = zenkana2Hankana(memberData[l]['business_last_name_yomi'] + " " + memberData[l]['business_first_name_yomi']);
      // 性別区分
      if (memberData[l]['gender'] == "male") {
        var sex = 1;
      } else if (memberData[l]['gender'] == "female") {
        var sex = 2;
      } else {
        var sex = 0;
      }
      // 生年月日
      var birthDate = memberData[l]['birth_at'].replace(/-/g, '-');
      // 入社年月日
      var enteredDate = memberData[l]['entered_at'].replace(/-/g, '-');  // ハイフンをスラッシュに変換

      /* 住所 */
      // 住所1
      var address1 = memberData[l]['address']['pref'] + memberData[l]['address']['city'] + memberData[l]['address']['street'];
      // 住所2
      var address2 = memberData[l]['address']['building'];
      // 住所フル
      var fullAddress = address1 + address2;
      // 住所カナ
      var addressKana = zenkana2Hankana(memberData[l]['address']['literal_yomi']);
      // 住民票住所1
      var residentCardAddress1 = memberData[l]['resident_card_address']['pref'] + memberData[l]['resident_card_address']['city'] + memberData[l]['resident_card_address']['street'];
      // 住民票住所2
      var residentCardAddress2 = memberData[l]['resident_card_address']['building'];
      // 住民票住所フル
      var fullResidentCardAddress = residentCardAddress1 + residentCardAddress2;
      // 住民票区分
      if (fullAddress == fullResidentCardAddress) {
        var residentCardType = 1;
      } else {
        var residentCardType = 0;
      }

      /* 家族 */
      // 家族姓カナ
      var familyLastNameKana = zenkana2Hankana(familyApiData[0]['last_name_yomi']);
      // 家族名カナ
      var familyFirstNameKana = zenkana2Hankana(familyApiData[0]['first_name_yomi']);
      // 性別区分
      if (familyApiData[0]['gender'] == "male") {
        var familySex = 1;
      } else if (familyApiData[0]['gender'] == "female") {
        var familySex = 2;
      } else {
        var familySex = 0;
      }
      // 生年月日
      var familyBirthDate = familyApiData[0]['birth_at'].replace(/-/g, '-');
      // 配偶者区分
      if (familyApiData[0]['is_spouse']) {
        var familyIsSpouse = 1;
      } else {
        var familyIsSpouse = 0;
      }
      // 同居区分、及び判定に伴う郵便番号・住所1・住所2
      if (familyApiData[0]['live_together_type'] == "living_together") {
        var familyLiveTogetherType = 1;
        var familyZipCode = memberData[l]['address']['zip_code'];
        var familyAddress1 = memberData[l]['address']['pref'] + memberData[l]['address']['city'] + memberData[l]['address']['street'];
        var familyAddress2 = memberData[l]['address']['building'];
      } else {
        var familyLiveTogetherType = 0;
        var familyZipCode = familyApiData[0]['address']['zip_code'];
        var familyAddress1 = familyApiData[0]['address']['pref'] + familyApiData[0]['address']['city'] + familyApiData[0]['address']['street'];
        var familyAddress2 = familyApiData[0]['address']['building'];
      }

      /* 税表区分 */
      // 課税区分
      if (memberData[l]['tax_cd'] == "kou") {
        var taxCategory = 1;
      } else if (memberData[l]['tax_cd'] == "otsu") {
        var taxCategory = 2;
      } else if (memberData[l]['tax_cd'] == "no_taxation_required") {
        var taxCategory = 5;
      }


      
      // 社員基本_配列に値をセット
      let baseData = [
        "100",  // データ区分(固定値)
        memberData[l]['emp_code'],  // 社員コード
        memberData[l]['last_name'] + " " + memberData[l]['first_name'],  // 氏名
        nameKana,  // 氏名カナ(半角)
        naming,  // 呼称適用 0:氏名を呼称として使用, 1:旧氏名を呼称として使用, 2:外国人氏名を呼称として使用
        memberData[l]['business_last_name'] + " " + memberData[l]['business_first_name'],  // 旧氏名
        businessNameKana,  // 旧氏名カナ(半角)
        sex,  // 性別区分 0:不明、1:男、2:女
        birthDate,  // 生年月日
        enteredDate,  // 入社年月日
        memberData[l]['tel_number'],  // 携帯電話番号
        memberData[l]['email']  // メールアドレス
      ]
      baseDataList.push(baseData);

      // 住所_配列に値をセット
      let addressData = [
        "111",  // データ区分(固定値)
        memberData[l]['emp_code'],  // 社員コード
        "2000-01-01",  // 入居年月日(一時的ダミー)
        residentCardType,  // 住民票区分 0:住民票住所でない, 1:住民票住所
        memberData[l]['address']['zip_code'],  // 郵便番号
        address1,  // 住所1
        address2,  // 住所2
        addressKana,  // 住所1カナ
        "",  // 住所2カナ
        memberData[l]['tel_number'],  // 電話番号
        "",  // 社員SEQ(値の入力は不要)
        ""  // 現住所区分
      ]
      addressDataList.push(addressData);

      // 家族_配列に値をセット
      let familyData = [
        "107",  // データ区分(固定値)
        memberData[l]['emp_code'],  // 社員コード
        // 続柄
        familyApiData[0]['last_name'],  // 家族姓
        familyApiData[0]['first_name'],  // 家族名
        familyLastNameKana,  // 家族姓カナ
        familyFirstNameKana,  // 家族名カナ
        familySex,  // 性別区分 0:不明, 1：男, 2：女
        familyBirthDate,  // 生年月日
        1,  // 税扶養区分 0:対象外, 1:対象(一時的ダミー)
        familyIsSpouse,  // 配偶者区分 0:配偶者以外, 1:配偶者
        familyLiveTogetherType,  // 同居区分 0:別居, 1:同居
        1,  // 障害区分 0:対象外, 1：一般, 2：特別(一時的ダミー)
        1,  // 健康保険区分 0:対象外, 1:対象(一時的ダミー)
        familyZipCode,  // 郵便番号
        familyAddress1,  // 住所1
        familyAddress2,  // 住所2
        familyApiData[0]['tel_number'],  // 電話番号
        ""  // 社員SEQ(値の入力は不要)
      ]
      familyDataList.push(familyData);

      // 税表区分
      let taxData = [
        "103",  // データ区分(固定値)
        memberData[l]['emp_code'],  // 社員コード
        taxCategory,  // 税表区分 1:甲, 2:乙, 3:定率, 4:定額, 5:税なし
        1,  // 障害区分 0:対象外, 1：一般, 2：特別(一時的ダミー)
      ]
      taxDataList.push(taxData);

      // 社会保険
      // let insuranceData = [
      //   "100", memberData[l].emp_code, memberData[l].last_name + " " + memberData[l].first_name, "ﾊﾝｶｸｶﾀｶﾅﾆﾍﾝｶﾝｶﾞﾋﾂﾖｳ", "0",
      //   memberData[l].business_last_name + " " + memberData[l].business_first_name, "ﾋﾞｼﾞﾈｽﾈｰﾑ", "2", memberData[l].birth_at,
      //   "2022-09-13", memberData[l].tel_number, memberData[l].email
      // ]
      // insuranceDataList.push(insuranceData);
    }


    export_csv(baseDataList, operation_type = 1.1);
    export_csv(addressDataList, operation_type = 1.2);
    export_csv(familyDataList, operation_type = 1.3);
    export_csv(taxDataList, operation_type = 1.4);
    // export_csv(insuranceDataList, operation_type = 1.5);

    // 終了ログ
  　log('入社_OBIC連携登録', 'e');
    SpreadsheetApp.getUi().alert("OBIC用CSVの出力が終了しました。");

  } catch(e) {
    SpreadsheetApp.getUi().alert("OBIC用CSVの出力に失敗しました。");
    SpreadsheetApp.getUi().alert(e.message);
  }
}

// 社員番号を照合し、連携登録対象の社員ID一覧データ配列を生成する
function createIdList() {
  try{
    // 社員番号入力シートに入力された従業員番号を取得する
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
    

    //社員番号が入力されている場合のみ実行
    if(lastRow > inputHeaderLine) {
      let employeeNumber = sheet.getRange(9,2,lastRow - inputHeaderLine,1).getValues();  //入力された社員番号を取得

      //取得した社員番号分繰り返し実行
      for(var i = 0; i < employeeNumber.length; i++) {
        for(var j = 0; j < logDate.length; j++) {
          //履歴データ新規の中に、入力した社員番号が存在するか
          if(logDate[j].includes(String(employeeNumber[i]))) {
            //存在した場合、リストにidを追加する
            idList.push(logDate[j][3]);
          }
        }
      }
      //入力された社員番号数と取得出来た社員番号数が一致しない　もしくは　全て間違って入力している
      if(idList.length !== employeeNumber.length || idList.length === 0) {
        SpreadsheetApp.getUi().alert("誤った社員番号が入力されています。");
        return false
      }
      
      return idList
    }
    SpreadsheetApp.getUi().alert("社員番号が入力されていません。");
    return false

  }catch(e) {
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

// 全角文字を半角文字に変換し呼び出し元へ返却する
function zenkana2Hankana(str) {
  var kanaMap = {
    "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
    "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
    "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
    "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
    "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
    "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
    "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
    "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
    "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
    "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
    "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
    "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
    "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
    "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
    "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
    "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
    "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
    "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
    "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･"
  }
  var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');

  return str.replace(reg,
    function (match) {
      return kanaMap[match];
  }).replace(/゛/g, 'ﾞ').replace(/゜/g, 'ﾟ');
}
