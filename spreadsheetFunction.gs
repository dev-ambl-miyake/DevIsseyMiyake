function create(json) {
  let ss = SpreadsheetApp.openById("1fOAz9iVZcLrIHxOW0hGkuPwnlvZXKVNyv9USsbW5Z9Y");
  let sheet = ss.getSheets()[0];
  let lastRow = sheet.getLastRow();  //最終行を取得
  let headerLine = 8;  //ヘッダーの行数

  //社員情報が表示されている場合のみ実行
  if(lastRow > headerLine) {
    //表示されている情報を取得
    let range = sheet.getRange(9,2,lastRow - headerLine,6);
    //値を取得
    let values = range.getValues();

    //取得した値の中に同じ社員番号が存在するか
    for(let i = 0; i < values.length; i++) {
      //同値の社員番号が存在したらその行を削除
      if(values[i].flat().includes(json)) {
        sheet.deleteRow(headerLine + i + 1);
        break;
      }
    }
  } 
}