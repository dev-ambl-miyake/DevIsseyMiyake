/**
 * みんなが呼び出す共通の処理
 * @param {string} processName  ログに表示する処理名
 * @param {string} status       処理が開始's'なのか、終了'e'なのか
 */
function log(processName, status) {
  //月ごとのフォルダを作成
  let targetFolder = createFolder();

  //status = s であるならば、開始を表示
  if(status === 's') {
    createFile(processName + '　開始', targetFolder);
  }
  //status = e であるならば、終了を表示
  else if(status === 'e') {
    createFile(processName + '　終了', targetFolder);
  }
}

function createFolder() {
  const logFolderId = getProperties("localLogFolderId");                              //プロパティから使用する値を取得
  const targetFolderName = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMM');  //探しに行くフォルダ名
  const logFolder = DriveApp.getFolderById(logFolderId);                              //探し元
  const folderIterator = logFolder.getFoldersByName(targetFolderName);　              //指定した名前のフォルダを取得

  let targetFolder;
  //存在する場合
  if(folderIterator.hasNext()) {
    targetFolder = folderIterator.next();
  }
  //存在しない場合
  else {
    targetFolder = logFolder.createFolder(targetFolderName);
  }
  return targetFolder;
}

function createFile(content, targetFolder) {
  const now = new Date();                                                                 //現在の時刻を取得
  const nowStr = Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss');          //Date型データにフォーマット
  const folder = targetFolder;                                                            //logを吐き出すフォルダ
  const files = folder.getFiles();                                                        //フォルダに存在するファイルを取得
  const contentType = 'text/plain';          　　　　　　　　　　　　　　　　　　　　　          //logとして吐き出すファイルの形式
  const charset = 'utf-8';                    　　　　　　　　　　　　　　　　　　　　　         //ファイルの文字コード
  const fileName =  Utilities.formatDate(now, 'Asia/Tokyo', 'yyyMMdd') + '_実行ログ.txt';  //ログのファイル名
  const logContent = '[' + nowStr + '] info ' + content;                                  //追加するログの中身

  

  //Blobを作成する
  const blob = Utilities.newBlob('', contentType, fileName,)
                        .setDataFromString(logContent, charset);
  
  let hasFileName = false  //同名のファイルが存在するか

  //フォルダ内全てのオブジェクトを繰り返し
  while (files.hasNext()) {
    const file = files.next();
    //同名ファイルが存在した場合の処理
    if(file.getName() === fileName) {
      hasFileName = true
      const logFile = folder.getFilesByName(fileName).next();  //logファイル
      const logFileID = logFile.getId();                       //logファイルのID
      const newFile = DriveApp.getFileById(logFileID);         //追記するファイルを選択
      const contents = logFile.getBlob()
                              .getDataAsString("utf-8");       //logファイルの中身を取得
      newFile.setContent(contents + "\n" + logContent);        //追記
      break
    }
  }
  //同名ファイルが存在しなかった場合
  if(!hasFileName) {
    folder.createFile(blob);  //ファイルを生成
  }
}