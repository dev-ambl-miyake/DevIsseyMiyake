function storeHistory(json) {
  //スプレッドシートオブジェクトを取得
  let ss = SpreadsheetApp.openById("1LAy0pR8m9wbdBB5E2dYj9FBBMmx2CQj56u9euVPKax0");
  let sheet = ss.getSheets()[0];
  let ssUpdate = SpreadsheetApp.openById("1Zrc7roMwhYIz4a5yp8uR60jDsKIr2Gffr7Rgd-648L0");
  let sheetUpdate = ssUpdate.getSheets()[0];
  let data = [];
  let updatedDate;
  let date = new Date();  //現在の日時を取得
  let lastUpdatedDate = sheet.getRange("H1").getValue();  //前回の更新日時を取得
  let lastUpdatedDateUpdate = sheetUpdate.getRange("H1").getValue();  //前回の更新日時を取得
  let lastRow = sheet.getLastRow();  //最終行を取得

  //ドキュメントロックを実施
  const lock = LockService.getDocumentLock();

  const employeeNumber = sheet.getRange(2,1,lastRow,1).getValues();
  
  if(lock.tryLock(1 * 1000)) {
    for(var i = 0; i < json.length; i++) {

      updatedDate = new Date(json[i].updated_at);
      
      //前回の更新日より最近に更新されているデータのみ追記する
      if(lastUpdatedDate < updatedDate) {

        //履歴データ新規に存在する場合
        if(employeeNumber.flat().includes(json[i].emp_code)) {
          data[i] = ["'" + json[i].emp_code, json[i].last_name, json[i].updated_at];
          sheetUpdate.appendRow(data[i]);
        }
        //履歴データ新規に存在しない場合
        else{
          data[i] = ["'" + json[i].emp_code, json[i].last_name, json[i].created_at, json[i].id];
          sheet.appendRow(data[i]);
        }
      }
    }
    //履歴データ新規
    //履歴データを作成日時でソートする
    lastRow = sheet.getLastRow();  //最終行を取得
    let historicData = sheet.getRange(2,1,lastRow,4);
    historicData.sort({column: 3, ascending: false});

    //前回の更新日時をスプレッドシートに記載
    sheet.getRange("F1").setValue(lastUpdatedDate);
    //H1のセルにスプレッドシートを起動した時刻を記載（更新日時となる）
    sheet.getRange("H1").setValue(date);


    //履歴データ更新
    //履歴データをアップデート日時でソートする
    let lastRowUpdate = sheetUpdate.getLastRow();  //最終行を取得
    let historicDataUpdate = sheetUpdate.getRange(2,1,lastRowUpdate,3);
    historicDataUpdate.sort({column: 3, ascending: false});

    //前回の更新日時をスプレッドシートに記載
    sheetUpdate.getRange("F1").setValue(lastUpdatedDateUpdate);
    //H1のセルにスプレッドシートを起動した時刻を記載（更新日時となる）
    sheetUpdate.getRange("H1").setValue(date);

    //ドキュメントロックを解除
    lock.releaseLock();
  }
}
