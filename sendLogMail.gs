/**
 * @param {string} work  業種
 * @param {string} error_message エラーメッセージ
*/
// 実行ログを管理者にメール送信する
function sendMail(work,error_message = null) {

  // 処理が成功したか失敗したかの取得
  if(error_message){
    var isSuccess = false; // 2022/09/06現在はスタブでログ対応
  }else{
    var isSuccess = true;
  }

  console.log(isSuccess);

  // 送信先(本番では管理者のメールアドレス)
  var address = 'daiki.kushibiki.ef@ambl.co.jp';

  // 処理が失敗していたらログを取得
  if(isSuccess == false){
    // 件名
    var subject = `【${work}】処理が失敗しました。`;

    // 本文
    var body 
    = `【${work}】処理が失敗しました。以下システムエラーログでになります。`
      + `\n ${error_message} \n`;
  } else {
    // 件名
    var subject = `【${work}】正常に処理が行われました。`;
    // 本文
    var body 
    = `【${work}】が正常に終了致しました。`;
  }
  GmailApp.sendEmail(address, subject, body);

}
