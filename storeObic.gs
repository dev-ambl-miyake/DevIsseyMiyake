function createIdList() {
  try{
    //社員番号入力シートに入力された従業員番号を取得する
    let ss = SpreadsheetApp.getActive();
    let sheet = ss.getActiveSheet();
    let lastRow = sheet.getLastRow();  //最終行を取得
    const inputHeaderLine = 8; //社員番号入力するまでの見出しの行数
  
    //履歴データ新規から入力された従業員番号のidを取得する
    let idList = [];  //空のリストを作成
    let logss = SpreadsheetApp.openById("1LAy0pR8m9wbdBB5E2dYj9FBBMmx2CQj56u9euVPKax0");
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

function createEmployeeList(idList) {
  const AccessToken = 'R4CrXND4R4xkpcv6WMPQJNxzg7ke4YhP'  //smartHRのアクセストークン
  const SubDomain = 'a6207dec84a2577ef2a94ee1'  //smartHRのサブドメイン

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
      //従業員リスト取得APIにリクエストを送信
      const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[k], params)
      //レスポンスを文字列で取得
      const responseBody = response.getContentText()
      //jsonオブジェクトに変換
      const json = JSON.parse(responseBody)

      responseList.push(json);
    }

    return responseList;

  }catch(e) {
    SpreadsheetApp.getUi().alert("smartHRからのデータ取得に失敗しました。");
  }
}

function createCSV() {

  // 開始ログ
  commonFunction.log('入社OBIC用CSV作成', 's');

  const employeeIdList = createIdList();
  if(!employeeIdList) {
    return
  }

  const memberData = createEmployeeList(employeeIdList);
  let dataList = [];

  try{
    for(var l = 0; l < memberData.length; l++) {
      let data = [
        "100", memberData[l].emp_code, memberData[l].last_name + " " + memberData[l].first_name, "ﾊﾝｶｸｶﾀｶﾅﾆﾍﾝｶﾝｶﾞﾋﾂﾖｳ", "0",
        memberData[l].business_last_name + " " + memberData[l].business_first_name, "ﾋﾞｼﾞﾈｽﾈｰﾑ", "2", memberData[l].birth_at,
        "2022-09-13", memberData[l].tel_number, memberData[l].email
      ]
      dataList.push(data);
    }

    commonFunction.export_csv(dataList, operation_type = 1);

    // 終了ログ
  　commonFunction.log('入社OBIC用CSV作成', 'e');

    SpreadsheetApp.getUi().alert("OBIC用CSVの出力が終了しました。");
  }catch(e) {
    SpreadsheetApp.getUi().alert("OBIC用CSVの出力に失敗しました。");
  }
}
