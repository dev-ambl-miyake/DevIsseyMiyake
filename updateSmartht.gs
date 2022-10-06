function shrMain() {
  let folderId = "1_Yc3q1b8ClYNbOW-orwejJTrfSlczhI8";
  let fileName = "announcement.csv";

  //ファイルが存在する場合のみ実行
  if(commonFunction.checkExistFile(folderId, fileName)) {
    let csv_announcement = commonFunction.import_csv(operation_type = 3.1)
    let csv_travel_allowance = commonFunction.import_csv(operation_type = 3.2)

    //csvにデータが存在する場合のみ実行
    if(csv_announcement.length > 0){
      let smartHR_data = changeDataToSHR(csv_announcement, csv_travel_allowance);

      updateSmarthr(smartHR_data);

    }
  }
}

function changeDataToSHR(csv_announcement, csv_travel_allowance) {
  
  let smartHR_data = [];

  try {

    for(let i = 0; i < csv_announcement.length; i++) {

      let data = [
        ("00000" + csv_announcement[i][0]).slice(-5),//職種　社員コード 5桁に変換
        csv_announcement[i][16],//雇用形態　社員区分
        csv_announcement[i][8],//職種
        csv_announcement[i][2],//所属名
        csv_announcement[i][12],//役職 
        csv_announcement[i][6],//グレード
        csv_announcement[i][10],//レベル
        csv_announcement[i][14],//勤務地
      ]

      for(let j = 0; j < csv_travel_allowance.length; j++) {
        //同じ社員番号のデータを取得
        if(csv_travel_allowance[j][1] === csv_announcement[i][0]) {
          data.push(csv_travel_allowance[j][18])//交通機関
          data.push(csv_travel_allowance[j][19])//乗車区間発
          data.push(csv_travel_allowance[j][20])//乗車区間経由
          data.push(csv_travel_allowance[j][21])//乗車区間着
          data.push(csv_travel_allowance[j][9])//設定金額
          data.push(csv_travel_allowance[j][22])//備考
        }
      }

      smartHR_data.push(data);

    }
    return smartHR_data

  } catch(e) {

  }
}

function getSmarthrId(smartHR_data) {
  let ss = SpreadsheetApp.openById("1LAy0pR8m9wbdBB5E2dYj9FBBMmx2CQj56u9euVPKax0");
  let sheet = ss.getSheets()[0];
  let lastRow = sheet.getLastRow();
  const range = sheet.getRange(2,1,lastRow, 4).getValues();  //履歴データ新規からデータを取得

  let idList = [];

  for(let i = 0; i < smartHR_data.length; i++) {
    for(let j = 0; j < range.length; j++) {
      if(range[j].includes(smartHR_data[i][0])) {
        idList.push(range[j][3])  //idのみ
      }
    }
  }
  return idList
}

function updateSmarthr(smartHR_data) {
  //エラー発生時の例外処理
  // try{
    // 開始ログ
    commonFunction.log('smartHR更新', 's');
    const AccessToken = 'R4CrXND4R4xkpcv6WMPQJNxzg7ke4YhP'  //smartHRのアクセストークン
    const SubDomain = 'a6207dec84a2577ef2a94ee1'  //smartHRのサブドメイン

    //HTTPリクエストヘッダーの作成
    const headers = {
      //アクセストークンの設定
      'Authorization': 'Bearer ' + AccessToken
    }

    let idList = getSmarthrId(smartHR_data);

    let json = [];

    //idList総数繰り返し取得
    for(let i = 0; i < idList.length; i++) {

      //HTTPリクエストのオプションの設定
      const params = {
        'method': 'patch',  //部分更新でリクエスト
        'headers' : headers,  //HTTPリクエストヘッダー
        'payload' : {
          "emp_code" : smartHR_data[i][0],//職種　社員コード
          //"emp_type" : smartHR_data[i][1],//雇用形態　社員区分 
          "emp_type" : "いみわからん",
          "employment_type": {
            "id": "ecfdbd34-3a00-4273-8d0b-bdda6206e276",
            "name": "ウルトラマン",
            "preset_type": null
          },
          //"" : smartHR_data[i][2],//職種
          "department" : smartHR_data[i][3],//所属名
          // "position" : smartHR_data[i][4],//役職 
          //csv_announcement[i][6],//グレード
          //csv_announcement[i][10],//レベル
          // "custom_fields" : {
          //   "value" : smartHR_data[i][7],//勤務地 カスタム項目
          //   "template" : {
          //     // "id" : ,
          //     "name" : "勤務地",
          //   }
          // }
        },
        'muteHttpExceptions': true
      }
console.log(params)
      //従業員リスト更新APIにリクエストを送信
      UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[i], params)

    }

    // 終了ログ
    commonFunction.log('smartHR更新', 'e');

  // }catch(e) {
  //   SpreadsheetApp.getUi().alert("smartHR更新中にエラーが発生しました。");
  // }
}