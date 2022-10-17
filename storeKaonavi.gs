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
  const token = commonFunction.getToken();
  let dataList = [];

  try{
    for(var l = 0; l < memberData.length; l++) {
      let data = {
        "code" : memberData[l].emp_code,
        "name" : memberData[l].business_last_name + " " + memberData[l].business_first_name,
        "name_kana": memberData[l].business_last_name_yomi + " " + memberData[l].business_first_name_yomi,
        "entered_date": memberData[l].entered_at,
        "gender": memberData[l].gender,
        "birthday" : memberData[l].birth_at,
        //"採用形態": 現在不明
        
      }
      dataList.push(data);
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
