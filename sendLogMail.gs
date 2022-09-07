// 実行ログを管理者にメール送信する
function sendMail() {

  // 業務の取得
  var work = '発令'; // 2022/09/06現在はスタブでログ対応

  // 処理が成功したか失敗したかの取得
  var isSuccess = false; // 2022/09/06現在はスタブでログ対応

  // 送信先(本番では管理者のメールアドレス)
  var address = 'daiki.kushibiki.ef@ambl.co.jp';

  // 処理が失敗していたらログを取得
  if(isSuccess == false){
    var log = 'スタブ失敗ログ';　// 2022/09/06現在はスタブログ対応ToDo ファイルをログ出力orエラーログを取得しJSON？
  
    // 件名
    var subject = `【${work}】処理が失敗しました。`;

    // 本文
    var body 
    = `【${work}】処理が失敗しました。以下システムエラーログでになります。`
      + `\n ${log} \n`;
  } else {
    // 件名
    var subject = `【${work}】正常に処理が行われました。`;
    // 本文
    var body 
    = `【${work}】が正常に終了致しました。`;
  }
  GmailApp.sendEmail(address, subject, body);

}
