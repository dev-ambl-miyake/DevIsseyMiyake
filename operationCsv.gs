  function getValues() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('シート1');

    // A2～C2セルを選択
    var range = sheet.getRange('A7:A123');
    var emp_codes = range.getValues();

    return emp_codes;
  }


　/**
   * @param {string} folder_id  指定ドライブフォルダID
   * @param {string} file_name  指定ファイル名
   * return {bool} is_exist ファイルがあるかないか
   */
  // 指定のドライブフォルダから対象のCSVファイルを参照する
  function checkExistFile(folder_id,file_name) {
    console.log(folder_id,file_name);
    // ファイルがあるかどうか確認
    var files = DriveApp.getFolderById("12iHSNa9Y_nwGZhZmcRQyVfuSsjItBRlW").getFilesByName("標準報酬月額10件.csv");
    if(files.hasNext()) {
      var is_exist = true;
    }else{
      var is_exist = false;
    }
    return is_exist;
  }

// CSV取り込み
function import_csv(operation_type = 5) {
  /* CSV設定 */
  // 発令
  if (operation_type === 3) {
    var define = define_announcement()
  // 標準報酬月額
  } else if (operation_type === 4) {
    var define = define_monthly_salary()
  // 源泉徴収票
  } else if (operation_type === 5) {
    var define = define_tax_withoutholding()
  // 年調・変動入力
  } else if (operation_type === 6) {
    var define = define_year_end_adjustment()
  } else {
    console.log('エラー')
  }

  // ドライブフォルダ, ファイル情報定義
  const folderId = define.import_folder_id
  const folder = DriveApp.getFolderById(folderId)
  const file_name = define.import_file_name

  const imported_files = folder.getFilesByName(file_name);
  const imported_file   = imported_files.next();
  const fileId = imported_file.getId();

  // Blob を作成する
  const blob = DriveApp.getFileById(fileId).getBlob();
  const csv = blob.getDataAsString("Shift_JIS");
  const csv_data = Utilities.parseCsv(csv);

  // インポートした取得データを出力用データに加工
  // 発令
  if (operation_type === 3) {
    var processed_data = processing_announcement_data(csv_data)
  // 標準報酬月額
  } else if (operation_type === 4) {
    var processed_data = processing_monthly_salary_data(csv_data)
  // 源泉徴収票
  } else if (operation_type === 5) {
    var processed_data = processing_tax_withoutholding_data(csv_data)
  // 年調変動入力
  } else if (operation_type === 6) {
    var processed_data = processing_year_end_adjustment(csv_data)
  } else {
    console.log('エラー')
  }

  return processed_data
}

/*
  //　業務種別ごとにCSVを出力する

  // array data
  // integer operation_type
    // 1: 入社
    // 2: 変更申請
    // 5: 源泉徴収票
    // 6: 年調変動入力
*/
// CSV出力
function export_csv(data, operation_type = 5) {
  /* CSV設定 */
  // 入社
  if (operation_type === 1) {
    //定義値
    var define = define_store_employee()
    // 見出し行
    var title_row = title_store_employee()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 変更申請
  } else if (operation_type === 2) {
    var define = define_update_employee()
  // 源泉徴収票
  } else if (operation_type === 5) {
    // 定義値
    var define = define_tax_withoutholding()
    // 見出し行
    var title_row = title_tax_withoutholding()
    // OBIC_CSVよりデータ取得
    var import_data = data;
  // 年調・変動入力
  } else if (operation_type === 6) {
    // 定義値
    var define = define_year_end_adjustment()
    // 見出し行
    var title_row = title_year_end_adjustment()
    // OBIC_CSVよりデータ取得
    var import_data = data;
  } else {
    console.log('エラー')
  }

  // コンテンツタイプ
  const content_type = 'text/csv'
  // 文字コード
  const charset = 'Shift_JIS'
  // 出力するファイル名
  const file_name = define.export_file_name
  // 出力先ドライブフォルダID
  const folder_id = define.export_folder_id
  // 出力するフォルダ
  const folder = DriveApp.getFolderById(folder_id);

  let csv_string = ""

  for (let tr of title_row) {
        csv_string += tr.join(",");
        csv_string += '\r\n';
  }
  for (let id of import_data){
    csv_string += id.join(",");
    csv_string += '\r\n';
  }
  
  // Blob を作成する
  const blob = Utilities.newBlob(csv_string, content_type, file_name).setDataFromString(csv_string, charset);

  // ファイルに保存
  folder.createFile(blob);
}

// 入社CSV_列名
function title_store_employee() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "氏名", "氏名ｶﾅ", "呼称適用", "旧氏名", "旧氏名ｶﾅ", "性別区分", "生年月日", "入社年月日", "携帯電話番号", "メールアドレス"
    ]
  ]
  return title_row
}

// 発令_インポートデータを出力用データ構造配列に加工
function processing_announcement_data(csv_data) {
  // csv_dataをループ、出力用データ構造配列に加工し返却
  // return processed_data
}
// 標準報酬月額_インポートデータを出力用データ構造配列に加工
function processing_monthly_salary_data(csv_data) {
  // csv_dataをループ、出力用データ構造配列に加工し返却
    // 取得データ行が1行以下ならファイル不備エラーメッセージ（※1行目は見出し）
    if(csv_data.length <= 1){
      var csv_error_message = '該当ファイルのデータは正しいデータ形式ではありません。';
      alert(csv_error_message);
      
      // 終了ログ
      log('源泉徴収票', 'e');
      return;
    }
    // csvの見出1行目を削除
    csv_data.shift();

    // csvの不要列の削除 ※spliceをループして不要列を順番に削除（必要列までは一括削除出来る）
      // データ区分の削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(0,1);
      }

      // 健保標準報酬月額までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(1,4);
      }

      // 健保整理番号までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(2,6);
      }

      // 厚年標準報酬月額までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(3,1);
      }

      // 厚年整理番号までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(4,5);
      }

      // 残りの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(7,46);
      }
    
    // 二次元配列で空になっている箇所を削除
    var array = csv_data.filter(v => v[0])
    
    // 文字加工
      // 社員コード（4桁→5桁）
      for (let i = 0; i < array.length; i++) {
         array[i][0] = '0'+ array[i][0];
      }

      // 基礎年金番号1-基礎年金番号2
      for (let i = 0; i < array.length; i++) {
        array[i][5] = array[i][5] + '-'+ array[i][6];
        // 不要になった列を削除
        array[i].splice(6,1);
      } 
  return array
}
// 源泉徴収票_インポートデータを出力用データ構造配列に加工
function processing_tax_withoutholding_data(csv_data) {
  // csv_dataをループ、出力用データ構造配列に加工し返却
    // 取得データ行が1行以下ならファイル不備エラーメッセージ（※1行目は見出し）
    if(csv_data.length <= 1){
      var csv_error_message = '該当ファイルのデータは正しいデータ形式ではありません。';
      alert(csv_error_message);
      
      // 終了ログ
      log('源泉徴収票', 'e');
      return;
    }
    // csvの見出1行目を削除
    csv_data.shift();
    // csvの不要列の削除
    for (let i = 0; i < csv_data.length; i++) {
      // 1行ずつ取り出して、インデックス0（1番目）から2個削除する。
      // TO do 最新の年末調整データ連携資料が来てから削除列の削除
      csv_data[i].splice(0,2);
    }

  return csv_data
}

// 年調変動_インポートデータを出力用データ構造配列に加工
function processing_year_end_adjustment(csv_data) {
  // csv_dataをループ、出力用データ構造配列に加工し返却
    // 取得データ行が1行以下ならファイル不備エラーメッセージ（※1行目は見出し）
    if(csv_data.length <= 1){
      var csv_error_message = '該当ファイルのデータは正しいデータ形式ではありません。';
      alert(csv_error_message);
      
      // 終了ログ
      log('年調・変動入力', 'e');
      return;
    }
    // csvの見出1行目を削除
    csv_data.shift();

    // csvの不要列の削除 ※spliceをループして不要列を順番に削除（必要列までは一括削除出来る）
      // データ区分の削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(0,1);
      }

      // 健保標準報酬月額までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(1,4);
      }

      // 健保整理番号までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(2,6);
      }

      // 厚年標準報酬月額までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(3,1);
      }

      // 厚年整理番号までの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(4,5);
      }

      // 残りの列削除
      for (let i = 0; i < csv_data.length; i++) {
        csv_data[i].splice(7,46);
      }
    
    // 二次元配列で空になっている箇所を削除
    var array = csv_data.filter(v => v[0])
    
    // 文字加工
      // 社員コード（4桁→5桁）
      for (let i = 0; i < array.length; i++) {
         array[i][0] = '0'+ array[i][0];
      }

      // 基礎年金番号1-基礎年金番号2
      for (let i = 0; i < array.length; i++) {
        array[i][5] = array[i][5] + '-'+ array[i][6];
        // 不要になった列を削除
        array[i].splice(6,1);
      } 
      console.log('アレイ'+array);
  return array
}

// 源泉徴収票CSV_列名
function title_tax_withoutholding() {
  // 見出し行
  const title_row = [
    [
      "受給者番号（社員番号）", "住所", "役職名", "氏名のフリガナ", "氏名", "種別", "支払金額", "支払金額（内）", "給与所得控除後の金額（調整控除後）",
      "所得控除の額の合計額", "源泉徴収税額", "源泉徴収税額（内）", "（源泉）控除対象配偶者（有）", "（源泉）控除対象配偶者（従有）", "（源泉）控除対象配偶者（老人）", "配偶者（特別）控除の額",
      "控除対象扶養（特定：人）", "控除対象扶養（特定：従人）", "控除対象扶養（老人：内）", "控除対象扶養（老人：人）", "控除対象扶養（老人：従人）", "控除対象扶養（その他：人）", "控除対象扶養（その他：従人）", 
      "16歳未満扶養親族の数", "障害者の数（特別：内）", "障害者の数（特別：人）", "障害者の数（その他）", "非居住者である親族の数",
      "社会保険料等の金額", "社会保険料等の金額（内）", "生命保険料の控除額", "地震保険料の控除額", "住宅借入金等特別控除の額", "摘要",
      "新生保保険料の金額", "旧生保保険料の金額", "介護医療保険の金額", "新個人年金の金額", "旧個人年金の金額",
      "住宅借入等適用数", "居住開始年月日(1回目)", "住宅借入金特別控除区分(1回目)", "住宅借入金等年末残高(1回目)", "住宅借入金等特別控除可能額",
      "居住開始年月日(2回目)", "住宅借入金特別控除区分(2回目)", "住宅借入金等年末残高(2回目)", "国民年金保険料等の金額", "旧長期損害保険料の金額", "基礎控除の額",
      "所得金額調整控除額", "（源泉・特別）控除対象配偶者（フリガナ）", "（源泉・特別）控除対象配偶者（氏名）", "（源泉・特別）控除対象配偶者（区分）", "配偶者の合計所得",
      "控除対象扶養親族（フリガナ）1", "控除対象扶養親族（氏名）1", "控除対象扶養親族（区分）1",
      "控除対象扶養親族（フリガナ）2", "控除対象扶養親族（氏名）2", "控除対象扶養親族（区分）2",
      "控除対象扶養親族（フリガナ）3", "控除対象扶養親族（氏名）3", "控除対象扶養親族（区分）3",
      "控除対象扶養親族（フリガナ）4", "控除対象扶養親族（氏名）4", "控除対象扶養親族（区分）4",
      "16歳未満の扶養親族（フリガナ）1", "16歳未満の扶養親族（氏名）1", "16歳未満の扶養親族（区分）1",
      "16歳未満の扶養親族（フリガナ）2", "16歳未満の扶養親族（氏名）2", "16歳未満の扶養親族（区分）2",
      "16歳未満の扶養親族（フリガナ）3", "16歳未満の扶養親族（氏名）3", "16歳未満の扶養親族（区分）3",
      "16歳未満の扶養親族（フリガナ）4", "16歳未満の扶養親族（氏名）4", "16歳未満の扶養親族（区分）4",
      "未成年者", "外国人", "死亡退職", "災害者", "乙欄", "本人が障害者（特別）", "本人が障害者（その他）", "寡婦", "ひとり親", "勤労学生",
      "中途就職・退職（就職）", "中途就職・退職（退職）", "中途就職・退職日", "退職日", "受給者生年月日", "支払者（住所）", "支払者（氏名）", "支払者（電話番号）"
    ]
  ]
  return title_row
}

// 年調・変動入力CSV_列名
function title_year_end_adjustment() {
  // 見出し行
  const title_row = [
    [
      "データ区分","対象年月","コード","税額表区分","対象者区分","種別","確定フラグ","過不足精算区分","申社保年金","申社保年金外","小規模共済","一般生保支払","個人年金支払","新一般生保支払","介護医療支払","新個人年金支払","長期損保支払","地震保険支払","配偶控除提出","その他所得","配偶合計所得","住宅控除申告","住宅控除適用数","家屋居住日_1","住宅控除区分_1","特定取得区分_1","住宅借入金等_1","基礎控除提出","所得控除提出"
    ]
  ]
  return title_row
}

/*
  // スタブデータ
  // 最終的に以下のデータ構造になるように出力対象データを加工する
  // 当関数内でOBIC_CSVを参照し内容を取得した後、
  // SmartHR取り込み用に配列データを形成し呼び出し元へ返却する
*/
// 源泉徴収票データ_スタブデータ
function stub_tax_withoutholding() {
  // 見出し行
  const data = [
    [
      "00021", "東京都品川区大崎", "1番隊隊長", "テストイチロウ", "テスト一郎", "給与・賞与", 6000000, 100000, 5500000,
      500000, 200000, 60000, 1, "", 1, 200000,
      10, 10, 2, 2, 2, 2, 2, 
      2, 2, 2, 2, 2,
      100000, 30000, 100000, 10000, 10000, '\"' + "国民年金等: 0 円\n住宅借入金等特別控除可能額: 10,000 円\n居住開始年月日: 2009 年 10 月 10 日" + '\"',
      10000, 10000, 10000, 10000, 10000,
      10, "2015/12/2", "その他", 1000000, 100000,
      "2016/12/1", "その他", 100000, 100000, 100000, 100000,
      100000, "スマエイコ", "須磨栄子", 1, 999999,
      "スマイチロウ", "須磨一郎", 1,
      "スマジロウ", "須磨二郎", 1,
      "スマサブロウ", "須磨三郎", 1,
      "スマシロウ", "須磨四郎", 1,
      "スマカズハ", "須磨一葉", 1,
      "スマフタバ", "須磨二葉", 1,
      "スマミツハ", "須磨三葉", 1,
      "スマヨツハ", "須磨四葉", 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, "2016/12/3", "2016/12/30", "1984/12/2", "東京都品川区大崎", "テスト一郎", "03-1234-5678"
    ],
    [
      "00022", "東京都品川区大崎", "1番隊副隊長", "テストイチロウマル", "テスト一郎丸", "給与・賞与", 6000000, 100000, 5500000,
      500000, 200000, 60000, 1, "", 1, 200000,
      10, 10, 2, 2, 2, 2, 2, 
      2, 2, 2, 2, 2,
      100000, 30000, 100000, 10000, 10000, '\"' + "国民年金等: 0 円\n住宅借入金等特別控除可能額: 10,000 円\n居住開始年月日: 2009 年 10 月 10 日" + '\"',
      10000, 10000, 10000, 10000, 10000,
      10, "2015/12/2", "その他", 1000000, 100000,
      "2016/12/1", "その他", 100000, 100000, 100000, 100000,
      100000, "スマエイコ", "須磨栄子", 1, 999999,
      "スマイチロウ", "須磨一郎", 1,
      "スマジロウ", "須磨二郎", 1,
      "スマサブロウ", "須磨三郎", 1,
      "スマシロウ", "須磨四郎", 1,
      "スマカズハ", "須磨一葉", 1,
      "スマフタバ", "須磨二葉", 1,
      "スマミツハ", "須磨三葉", 1,
      "スマヨツハ", "須磨四葉", 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, "2016/12/3", "2016/12/30", "1984/12/2", "東京都品川区大崎", "テスト一郎丸", "03-1234-5678"
    ]
  ]

  return data
}

// 業務_入社
function define_store_employee() {
  const define = { 
    'export_folder_id': '1wTNnVXEQsBbYLzXFpFHJagQ-83PSbKo_',
    'export_file_name': 'store_employee.csv',
  }
  return define
}
// 業務_変更申請
function define_update_employee() {
  const define = { 
    'export_folder_id': '',
    'export_file_name': 'update_employee.csv',
  }
  return define
}
// 業務_発令
function define_announcement() {
  const define = { 
    'import_folder_id': '',
    'import_file_name': 'announcement.csv',
  }
  return define
}
// 業務_標準報酬月額
function define_monthly_salary() {
  const define = { 
    'import_folder_id': '',
    'import_file_name': 'monthly_salary.csv',
  }
  return define
}
// 業務_源泉徴収票
function define_tax_withoutholding() {
  const define = { 
    // 環境毎に記載
    'import_folder_id': '',
    'export_folder_id': '',
    'import_file_name': '',
    'export_file_name': '',
  }
  return define
}

// 業務_年調・変動入力
function define_year_end_adjustment() {
  const define = { 
    // 環境毎に記載
    'import_folder_id': '1ZMVqgIfkFxsExpq7fk9UVOoRQdnHMB3E',
    'export_folder_id': '',
    'import_file_name': 'SHR_源泉徴収票_サンプル.csv',
    'export_file_name': '',
  }
  return define
}