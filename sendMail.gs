function sendMail() {
  const recipient = 'ryusei.uchiyama.ot@ambl.co.jp';　   //送信先のメールアドレス
  const subject = '【テスト】メール送信テスト'; 　　     　 　//件名
  const recipientCompany = '株式会社AMBL';　             　//送信先の会社名
  const recipientName = 'GoogleAppsScript';　                   　//送信先の担当者名
  const body = `${recipientCompany}\n${recipientName}様\n`
    + '\n＊＊テストメールです＊＊\n';                 　    //本文
  const options = { name: '株式会社GAS メール担当', from: 'ryusei.uchiyama.ot+test@ambl.co.jp'};  //送信者の名前
  GmailApp.sendEmail(recipient, subject, body, options);
}