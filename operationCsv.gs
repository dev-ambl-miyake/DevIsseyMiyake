
　/**
   * @param {string} folder_id  指定ドライブフォルダID
   * @param {string} file_name  指定ファイル名
   * return {bool} is_exist ファイルがあるかないか
   */
  // 指定のドライブフォルダから対象のCSVファイルを参照する
  function checkExistFile(folder_id,file_name) {
    // ファイルがあるかどうか確認
    var files = DriveApp.getFolderById(folder_id).getFilesByName(file_name);
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
  // 発令　現職本務データ
  if (operation_type === 3.1) {
    var define = define_announcement()
  // 発令　通勤手当（公共）
  }else if (operation_type === 3.2) {
    var define = define_travel_allowance()
  // 発令　現職兼務
  }else if (operation_type === 3.3) {
    var define = define_sub_business()
    // 発令　発令履歴兼務
  }else if (operation_type === 3.4) {
    var define = define_proclamation_history()
    // 発令　本務経歴
  }else if (operation_type === 3.5) {
    var define = define_main_hstory()
  // 標準報酬月額
  } else if (operation_type === 4) {
    var define = define_monthly_salary()
  // 源泉徴収票
  } else if (operation_type === 5) {
    var define = define_tax_withoutholding()
  } else {
    throw new Error("正しい業務定数が設定されていません。");
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
  // 発令　現職本務データ
  if (operation_type === 3.1) {
    var processed_data = processing_data(csv_data)
  // 発令　通勤手当
  } else if (operation_type === 3.2) {
    var processed_data = processing_data(csv_data)
    // 発令　現職兼務データ
  } else if (operation_type === 3.3) {
    var processed_data = processing_data(csv_data)
  } else if (operation_type === 3.4) {
    var processed_data = processing_data(csv_data)
  } else if (operation_type === 3.5) {
    var processed_data = processing_data(csv_data)
  // 標準報酬月額
  } else if (operation_type === 4) {
    var processed_data = processing_monthly_salary_data(csv_data)
  // 源泉徴収票
  } else if (operation_type === 5) {
    var processed_data = processing_tax_withoutholding_data(csv_data)
  } else {
    throw new Error("正しい業務定数が設定されていません。");
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
  // 社員基本
  if (operation_type === 1.1) {
    //定義値
    var define = define_store_employee_base()
    // 見出し行
    var title_row = title_store_employee_base()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 住所
  } else if (operation_type === 1.2) {
    var define = define_store_employee_address()
    // 見出し行
    var title_row = title_store_employee_address()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 家族
  } else if (operation_type === 1.3) {
    var define = define_store_employee_family()
    // 見出し行
    var title_row = title_store_employee_family()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 税表区分
  } else if (operation_type === 1.4) {
    var define = define_store_employee_tax()
    // 見出し行
    var title_row = title_store_employee_tax()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 社会保険
  } else if (operation_type === 1.5) {
    var define = define_store_employee_insurance()
    // 見出し行
    var title_row = title_store_employee_insurance()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 変更申請
  // 社員基本
  } else if (operation_type === 2.1) {
    //定義値
    var define = define_update_employee_base()
    // 見出し行
    var title_row = title_update_employee_base()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 住所
  } else if (operation_type === 2.2) {
    var define = define_update_employee_address()
    // 見出し行
    var title_row = title_update_employee_address()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 家族
  } else if (operation_type === 2.3) {
    var define = define_update_employee_family()
    // 見出し行
    var title_row = title_update_employee_family()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 税表区分
  } else if (operation_type === 2.4) {
    var define = define_update_employee_tax()
    // 見出し行
    var title_row = title_update_employee_tax()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 社会保険
  } else if (operation_type === 2.5) {
    var define = define_update_employee_insurance()
    // 見出し行
    var title_row = title_update_employee_insurance()
    // smartHRAPIよりデータ取得
    var import_data = data;
  // 源泉徴収票
  } else if (operation_type === 5) {
    // 定義値
    var define = define_tax_withoutholding()
    // 見出し行
    var title_row = title_tax_withoutholding()
    // OBIC_CSVよりデータ取得
    var import_data = data;
  } else {
    throw new Error("正しい業務定数が設定されていません。");
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

// 入社_社員基本CSV_列名
function title_store_employee_base() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "氏名", "氏名ｶﾅ", "呼称適用", "旧氏名", "旧氏名ｶﾅ", "性別区分", "生年月日", "入社年月日", "携帯電話番号", "メールアドレス"
    ]
  ]
  return title_row
}

// 入社_住所CSV_列名
function title_store_employee_address() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "入居年月日", "住民票区分", "郵便番号", "住所1", "住所2", "住所1カナ", "住所2カナ", "電話番号", "社員SEQ", "現住所区分" 
    ]
  ]
  return title_row
}

// 入社_家族CSV_列名
function title_store_employee_family() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "続柄", "家族姓", "家族名", "家族姓カナ", "家族名カナ", "性別区分", "生年月日", "税扶養区分", "配偶者区分",
      "同居区分", "障害区分", "健康保険区分", "郵便番号", "住所1", "住所2", "電話番号", "社員SEQ"
    ]
  ]
  return title_row
}

// 入社_税表区分CSV_列名
function title_store_employee_tax() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "税表区分", "障害区分"
    ]
  ]
  return title_row
}

// 入社_社会保険CSV_列名
function title_store_employee_insurance() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "基礎年金番号1", "基礎年金番号2", "雇用保険番号1", "雇用保険番号2", "雇用保険番号3"
    ]
  ]
  return title_row
}

// 変更申請_社員基本CSV_列名
function title_update_employee_base() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "氏名", "氏名ｶﾅ", "呼称適用", "旧氏名", "旧氏名ｶﾅ", "性別区分", "生年月日", "入社年月日", "携帯電話番号", "メールアドレス"
    ]
  ]
  return title_row
}

// 変更申請_住所CSV_列名
function title_update_employee_address() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "入居年月日", "住民票区分", "郵便番号", "住所1", "住所2", "住所1カナ", "住所2カナ", "電話番号", "社員SEQ", "現住所区分" 
    ]
  ]
  return title_row
}

// 変更申請_家族CSV_列名
function title_update_employee_family() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "続柄", "家族姓", "家族名", "家族姓カナ", "家族名カナ", "性別区分", "生年月日", "税扶養区分", "配偶者区分",
      "同居区分", "障害区分", "健康保険区分", "郵便番号", "住所1", "住所2", "電話番号", "社員SEQ"
    ]
  ]
  return title_row
}

// 変更申請_税表区分CSV_列名
function title_update_employee_tax() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "税表区分", "障害区分"
    ]
  ]
  return title_row
}

// 変更申請_社会保険CSV_列名
function title_update_employee_insurance() {
  // 見出し行
  const title_row = [
    [
      "データ区分", "社員コード", "基礎年金番号1", "基礎年金番号2", "雇用保険番号1", "雇用保険番号2", "雇用保険番号3"
    ]
  ]
  return title_row
}

// 発令_インポートデータを出力用データ構造配列に加工
function processing_data(csv_data) {
  // csv_dataをループ、出力用データ構造配列に加工し返却
  // 取得データ行が1行以下ならファイル不備エラーメッセージ（※1行目は見出し）
  if(csv_data.length <= 1){
    throw new Error("該当ファイルのデータは正しいデータ形式ではありません。")
  }
  // csvの見出1行目を削除
  csv_data.shift();
  var array = csv_data.filter(v => v[0])
  return array
}
// 標準報酬月額_インポートデータを出力用データ構造配列に加工
function processing_monthly_salary_data(csv_data) {
  // csv_dataをループ、出力用データ構造配列に加工し返却
    // 取得データ行が1行以下ならファイル不備エラー終了（※1行目は見出し）
    if(csv_data.length <= 1){
      throw new Error("該当ファイルのデータは正しいデータ形式ではありません。")      
    }
    // csvの見出1行目を削除
    csv_data.shift();

    // csvの不要列の削除 ※spliceをループして不要列を順番に削除（必要列までは一括削除出来る）
    // データ区分列削除
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i].splice(0,1);
    }

    // 健保標準報酬月額までの列削除
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i].splice(1,4);
    }

    // 健保改定年月までの列削除
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i].splice(2,2);
    }

    // 厚年標準報酬月額までの列削除
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i].splice(3,5);
    }

    // 社保FD用氏名までの列削除
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i].splice(4,17);
    }

    // 残りの列削除
    for (let i = 0; i < csv_data.length; i++) {
      csv_data[i].splice(5,36);
    }
    
    // 二次元配列で空になっている箇所を削除
    var array = csv_data.filter(v => v[0])
    
    // 文字加工
    // 社員コード（4桁→5桁）
    for (let i = 0; i < array.length; i++) {
        array[i][0] = '0'+ array[i][0];
    }

    // 改訂年月日（yyyymm → yyyy//mm/01）
    for (let i = 0; i < array.length; i++) {
      var year = array[i][2].slice(0,4); // 年の抽出
      var month = array[i][2].slice(-2); // 月の抽出
        array[i][2] = year + '/' + month + '/' + '01';
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
      
      throw new Error("該当ファイルのデータは正しいデータ形式ではありません。");
    }

    // csvの見出行を削除
    csv_data.shift();
    csv_data.shift();

    // csvの不要列の削除
    for (let i = 0; i < csv_data.length; i++) {
      // 1行ずつ取り出して、インデックス0（1番目）から2個削除する。
      csv_data[i].splice(0,4); // OBIC項目順 0-3
      csv_data[i].splice(107,2); // 3,4,5
    }

    // 二次元配列で空になっている箇所を削除
    var array = csv_data.filter(v => v[0])
    
    // 文字加工
      // 社員コード（4桁→5桁）
      for (let i = 0; i < array.length; i++) {
         array[i][0] = '0'+ array[i][0];
      }

      // 住所 (〒111-1111 東京都xxxxxxマンション名)
      for (let i = 0; i < array.length; i++) {
        array[i][1] = 
        '〒' + array[i][1] + '-'+ array[i][2] + ' ' + array[i][3]+ array[i][4];
      } 

      // 摘要
      for (let i = 0; i < array.length; i++) {
        if(array[i][35] === "" || array[i][35] === null){
          array[i][35] = '';
        }else{
          array[i][35] = 
          array[i][35] + 
          ' ' + '前職支払金額' + array[i][36] + '円' + ' ' +
          '前職社会保険料' + array[i][37] + '円' + ' ' +
          '前職所得税' + array[i][38] + '円' + ' ' 　;
        }
      }

      // 居住開始年月日(1回目) 数字2桁→元号（※平成21年より前は非対応）
      for (let i = 0; i < array.length; i++) {
        if(array[i][45] === "" || array[i][45] === null){
          array[i][45] = '';
        }else{
            array[i][45] = shiftToSeireki(array[i][45]);
            array[i][45] = array[i][45] + '/' + array[i][46] + '/' + array[i][47]
        }
      }

      // 居住開始年月日(2回目) 数字2桁→元号（※平成21年より前は非対応）
      for (let i = 0; i < array.length; i++) {
        if(array[i][51] === "" || array[i][51] === null){
          array[i][51] = '';
        }else{
            array[i][51] = shiftToSeireki(array[i][51]);
            array[i][51] = array[i][51] + '/' + array[i][52] + '/' + array[i][53]
        }
      }

      // 本人寡婦
      for (let i = 0; i < array.length; i++) {
        if(array[i][95] === '1' || array[i][96] === '1'){
          array[i][95] = 1;
        }else{
            array[i][95] = 0;
        }
      }

      // 支払金額（SmartHRでは必須項目の為、空である場合、０を宣言）
      for (let i = 0; i < array.length; i++) {
        if(array[i][9] === ""){
          array[i][9] = 0;
        }
      }

      // 源泉徴収税額（SmartHRでは必須項目の為、空である場合、０を宣言）
      for (let i = 0; i < array.length; i++) {
        if(array[i][13] === ""){
          array[i][13] = 0;
        }
      }

      // 中途区分(2:退職 1:就職)
      for (let i = 0; i < array.length; i++) {
        if(array[i][99] === '2'){
          // 中途区分が退職
          array[i][107] = 0; // 中途就職・退職（就職）
          array[i][108] = 1; // 中途就職・退職（退職）
          array[i][109] = ''; // 中途就職・退職日
          array[i][110] = shiftToSeireki(array[i][100]); // 退職日
          array[i][110] = array[i][110] + '/' + array[i][101] + '/' + array[i][102]; // 中途就職・退職日
        }else if(array[i][99] === '1'){
          // 中途区分が入社
          array[i][107] = 1; // 中途就職・退職（就職）
          array[i][108] = 0; // 中途就職・退職（退職）
          array[i][109] = shiftToSeireki(array[i][100]); // 中途就職・退職日
          array[i][109] = array[i][109] + '/' + array[i][101] + '/' + array[i][102]; // 中途就職・退職日
          array[i][110] = ''; // 退職日
        }else{
          array[i][107] = 0; // 中途就職・退職（就職）
          array[i][108] = 0; // 中途就職・退職（退職）
          array[i][109] = ''; // 中途就職・退職日
          array[i][110] = ''; // 退職日
        }
      }

      //（源泉）控除対象配偶者（有）
      //（源泉）控除対象配偶者（従有）
      // OBIC出力(源泉)控除対象配偶者の有無が3の場合SmartHRでは1、3以外の場合0
      for (let i = 0; i < array.length; i++) {
        if(array[i][15] == 3){
          array[i][15] = 1;
          array[i][111] = 1;
        }else{
          array[i][15] = 0;
          array[i][111] = 0;
        }
      }

      // （源泉・特別）控除対象配偶者（区分）
      for (let i = 0; i < array.length; i++) {
        if(array[i][62] == "00"){
          array[i][62] = 0;
        }
      }

      // 控除対象扶養親族（区分）1
      for (let i = 0; i < array.length; i++) {
        if(array[i][66] == "00"){
          array[i][66] = 0;
        }
      }

      // 控除対象扶養親族（区分）2
      for (let i = 0; i < array.length; i++) {
        if(array[i][69] == "00"){
          array[i][69] = 0;
        }
      }

      // 控除対象扶養親族（区分）3
      for (let i = 0; i < array.length; i++) {
        if(array[i][72] == "00"){
          array[i][672] = 0;
        }
      }

      // 控除対象扶養親族（区分）4
      for (let i = 0; i < array.length; i++) {
        if(array[i][75] == "00"){
          array[i][75] = 0;
        }
      }

      // 16歳未満の扶養親族（区分）1
      for (let i = 0; i < array.length; i++) {
        if(array[i][78] == "00"){
          array[i][78] = 0;
        }
      }

      // 16歳未満の扶養親族（区分）2
      for (let i = 0; i < array.length; i++) {
        if(array[i][81] == "00"){
          array[i][81] = 0;
        }
      }

      // 16歳未満の扶養親族（区分）3
      for (let i = 0; i < array.length; i++) {
        if(array[i][84] == "00"){
          array[i][84] = 0;
        }
      }

      // 16歳未満の扶養親族（区分）4
      for (let i = 0; i < array.length; i++) {
        if(array[i][87] == "00"){
          array[i][87] = 0;
        }
      }



  // SmartHR取り込み用の順番に配列を並び替える
  map_csv_data= array.map(elm => [
    elm[0], // 社員コード
    elm[1], // 本人住所
    elm[5], // 役職名
    elm[6], // カナ氏名
    elm[7], // 氏名
    elm[8], // 種別
    elm[9], // 支払金額
    elm[10], // 未払金額
    elm[11], // 給与所得控除後金額
    elm[12], // 所得控除の合計
    elm[13], // 源泉徴収税額
    elm[14], // 未徴収税額
    elm[15], // (源泉)控除対象配偶者の有無
    elm[111],  // ※OBICではなし（源泉）控除対象配偶者（従有）
    elm[16], // 老人控除対象配偶者
    elm[17], // 配偶者(特別)控除額
    elm[18], // 特定扶養人数 主
    elm[19], // 特定扶養人数 従
    elm[20], // 同 内訳 主
    elm[21], // 老人扶養人数 主
    elm[22], // 老人扶養人数 従
    elm[23], // その他人数 主
    elm[24], // その他人数 従
    elm[25], // 16歳未満扶養親族の数
    elm[26], // 同 内訳
    elm[27], // 特別障害者人数
    elm[28], // その他障害者人数
    elm[29], // 非居住者である親族の数
    elm[30], // 社会保険料等金額
    elm[31], // 同 内訳
    elm[32], // 生命保険料控除
    elm[33], // 地震保険料控除
    elm[34], // 住宅特別控除額
    elm[35], // 摘要
    elm[39], // 新生命保険料
    elm[40], // 旧生命保険料
    elm[41], // 介護医療保険料
    elm[42], // 新個人年金保険料
    elm[43], // 旧個人年金保険料
    elm[44], // 住宅控除適用数
    elm[45], // 居住開始年月日(1回目)
    elm[48], // 住宅控除区分(1回目)
    elm[49], // 住宅借入金等(1回目)
    elm[50], // 住宅控除可能額
    elm[51], // 住宅控除居住年(2回目)
    elm[54], // 住宅控除区分(2回目)
    elm[55], // 住宅借入金等(2回目)
    elm[56], // 国民年金保険料等の金額
    elm[57], // 長期損保保険料
    elm[58], // 基礎控除の額
    elm[59], // 所得金額調整控除額
    elm[60], // 配偶者カナ氏名
    elm[61], // 配偶者氏名
    elm[62], // 配偶者非居住区分
    elm[63], // 配偶者合計所得
    elm[64], // 扶養者1カナ氏名
    elm[65], // 扶養者1氏名
    elm[66], // 扶養者1非居住区分
    elm[67], // 扶養者2カナ氏名
    elm[68], // 扶養者2氏名
    elm[69], // 扶養者2非居住区分
    elm[70], // 扶養者3カナ氏名
    elm[71], // 扶養者3氏名
    elm[72], // 扶養者3非居住区分
    elm[73], // 扶養者4カナ氏名
    elm[74], // 扶養者4氏名
    elm[75], // 扶養者4非居住区分
    elm[76], // 16歳未満扶養者1カナ氏名
    elm[77], // 16歳未満扶養者1氏名
    elm[78], // 16歳未満扶養者1非居住区分
    elm[79], // 16歳未満扶養者2カナ氏名
    elm[80], // 16歳未満扶養者2氏名
    elm[81], // 16歳未満扶養者2非居住区分
    elm[82], // 16歳未満扶養者3カナ氏名
    elm[83], // 16歳未満扶養者3氏名
    elm[84], // 16歳未満扶養者3非居住区分
    elm[85], // 16歳未満扶養者4カナ氏名
    elm[86], // 16歳未満扶養者4氏名
    elm[87], // 16歳未満扶養者4非居住区分
    elm[88], // 未成年者
    elm[89], // 外国人
    elm[90], // 死亡退職
    elm[91], // 災害者
    elm[92], // 乙欄適用
    elm[93], // 本人特別障害者
    elm[94], // 本人その他障害者
    elm[95], // 寡婦
    elm[97], // ひとり親
    elm[98], // 本人勤労学生
    elm[107], // 中途就職・退職（就職）
    elm[108], // 中途就職・退職（退職）
    elm[109], // 中途就職・退職日
    elm[110], // 退職日
    elm[103], // 生年月日
    elm[104], // 支払者住所
    elm[105], // 支払者名
    elm[106], // 支払者電話番号
  ]);

  return map_csv_data
}

// 源泉徴収票CSV_列名
function title_tax_withoutholding() {
  // 見出し行
  const title_row = [
    [
      "受給者番号（社員番号）", 
      "住所",
      "役職名",
      "氏名のフリガナ",
      "氏名",
      "種別",
      "支払金額",
      "支払金額（内）",
      "給与所得控除後の金額（調整控除後）",
      "所得控除の額の合計額",
      "源泉徴収税額",
      "源泉徴収税額（内）",
      "（源泉）控除対象配偶者（有）",
      "（源泉）控除対象配偶者（従有）",
      "（源泉）控除対象配偶者（老人）",
      "配偶者（特別）控除の額",
      "控除対象扶養（特定：人）",
      "控除対象扶養（特定：従人）",
      "控除対象扶養（老人：内）",
      "控除対象扶養（老人：人）",
      "控除対象扶養（老人：従人）",
      "控除対象扶養（その他：人）",
      "控除対象扶養（その他：従人）", 
      "16歳未満扶養親族の数",
      "障害者の数（特別：内）",
      "障害者の数（特別：人）",
      "障害者の数（その他）",
      "非居住者である親族の数",
      "社会保険料等の金額",
      "社会保険料等の金額（内）",
      "生命保険料の控除額",
      "地震保険料の控除額",
      "住宅借入金等特別控除の額",
      "摘要",
      "新生保保険料の金額",
      "旧生保保険料の金額",
      "介護医療保険の金額",
      "新個人年金の金額",
      "旧個人年金の金額",
      "住宅借入等適用数",
      "居住開始年月日(1回目)",
      "住宅借入金特別控除区分(1回目)",
      "住宅借入金等年末残高(1回目)",
      "住宅借入金等特別控除可能額",
      "居住開始年月日(2回目)",
      "住宅借入金特別控除区分(2回目)",
      "住宅借入金等年末残高(2回目)",
      "国民年金保険料等の金額",
      "旧長期損害保険料の金額",
      "基礎控除の額",
      "所得金額調整控除額",
      "（源泉・特別）控除対象配偶者（フリガナ）",
      "（源泉・特別）控除対象配偶者（氏名）",
      "（源泉・特別）控除対象配偶者（区分）",
      "配偶者の合計所得",
      "控除対象扶養親族（フリガナ）1",
      "控除対象扶養親族（氏名）1",
      "控除対象扶養親族（区分）1",
      "控除対象扶養親族（フリガナ）2",
      "控除対象扶養親族（氏名）2",
      "控除対象扶養親族（区分）2",
      "控除対象扶養親族（フリガナ）3",
      "控除対象扶養親族（氏名）3",
      "控除対象扶養親族（区分）3",
      "控除対象扶養親族（フリガナ）4",
      "控除対象扶養親族（氏名）4",
      "控除対象扶養親族（区分）4",
      "16歳未満の扶養親族（フリガナ）1",
      "16歳未満の扶養親族（氏名）1",
      "16歳未満の扶養親族（区分）1",
      "16歳未満の扶養親族（フリガナ）2",
      "16歳未満の扶養親族（氏名）2",
      "16歳未満の扶養親族（区分）2",
      "16歳未満の扶養親族（フリガナ）3",
      "16歳未満の扶養親族（氏名）3",
      "16歳未満の扶養親族（区分）3",
      "16歳未満の扶養親族（フリガナ）4",
      "16歳未満の扶養親族（氏名）4",
      "16歳未満の扶養親族（区分）4",
      "未成年者",
      "外国人",
      "死亡退職",
      "災害者",
      "乙欄",
      "本人が障害者（特別）",
      "本人が障害者（その他）",
      "寡婦",
      "ひとり親",
      "勤労学生",
      "中途就職・退職（就職）",
      "中途就職・退職（退職）",
      "中途就職・退職日",
      "退職日",
      "受給者生年月日",
      "支払者（住所）",
      "支払者（氏名）",
      "支払者（電話番号）"
    ]
  ]
  return title_row
}

/**
 *  二桁の数字から和暦を抽出
 * @param {string} year  二桁の数字（'01'）
 * return {string} year 和暦年（令和1年）
 */
function shiftToSeireki(year) {
  // 文字列→数値
  var year = Number(year);


  // 現在年の抽出
  var date = new Date(); //現在日時を取得
  date = Utilities.formatDate(date,"Asia/Tokyo","yyyy");
  
  // 住宅控除の適用年数(西暦)
  thirteenYearsAgoSeireki = date - 15; // 住宅控除適用期間年数

  //住宅控除の適用年数(和暦)
  thirteenYearsAgoWareki = seirekiToWareki(thirteenYearsAgoSeireki);


  //住宅控除の適用年数の元号年
  intThirteenYearsAgoWareki = thirteenYearsAgoWareki.slice(2);
  intThirteenYearsAgoWareki = intThirteenYearsAgoWareki.slice(0, -1);
  intThirteenYearsAgoWareki = parseInt(intThirteenYearsAgoWareki);


  // この計算だと15年後に平成の選択肢が変わるので対応する必要有?
  if(year < intThirteenYearsAgoWareki){
    var isReiwa = true;
    var reki = "令和";
  }else{
    var isReiwa = false;
    var reki = "平成";
  }
  year = warekiToYear(reki,year);

  return year
}

/**
 * 西暦から和暦を返すカスタム関数
 * 
 * @param {Number} 西暦
 * @return {String} 和暦
 * @customfunction
 */
function seirekiToWareki(n){

  var result;

  if(n >= 2019){
    result = "令和"+(n-2018)+"年";
  }else if(n >= 1989){
    result = "平成"+(n-1988)+"年";
  }else if(n >= 1926){
    result = "昭和"+(n-1925)+"年";
  }else if(n >= 1912){
    result = "大正"+(n-1911)+"年";
  }else if(n >= 1868){
    result = "明治"+(n-1867)+"年";
  }else{
    throw new Error("西暦から和暦の変換時にエラーが発生しました。")
  }

  return result;
}

/**
 * 和暦から西暦を返すカスタム関数
 * 
 * @param {String} 元号 
 * @param {Number} 元号年
 * @return {Number} year 西暦年
 * @customfunction
 */
var warekiToYear =  function(reki, year)
{
    if ((reki == "令和") && (year > 0)) 
    {
        return year + 2018;
    }
    else if ((reki == "平成") && (year > 0)  && (year <= 31)) 
    {
        return year + 1988;
    }
    else if ((reki == "昭和") && (year > 0) && (year <= 64)) 
    {
        return year + 1925;
    }
    else if ((reki == "大正") && (year > 0) && (year <= 15)) 
    {
        return year + 1911;
    }
    else if ((reki == "明治") && (year > 0) && (year <= 45))
    {
        return year + 1867;
    }
    else{return 0}
};

// 業務_入社_社員基本
function define_store_employee_base() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicBaseCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_入社_住所
function define_store_employee_address() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicAddressCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_入社_家族
function define_store_employee_family() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicFamilyCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_入社_税表区分
function define_store_employee_tax() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicTaxCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_入社_社会保険
function define_store_employee_insurance() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicInsuranceCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_変更申請_社員基本
function define_update_employee_base() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicBaseCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_変更申請_住所
function define_update_employee_address() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicAddressCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_変更申請_家族
function define_update_employee_family() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicFamilyCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_変更申請_税表区分
function define_update_employee_tax() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicTaxCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_変更申請_社会保険
function define_update_employee_insurance() {
  const define = { 
    'export_folder_id': getProperties("obicExportCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'export_file_name': getProperties("obicInsuranceCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_発令_現職本務データ
function define_announcement() {
  const define = { 
    'import_folder_id': getProperties("obicCsvFolderId"),
    'import_file_name': getProperties("gensyokuHonmuCsv"),
  }
  return define
}
// 業務_発令_通勤手当（公共）
function define_travel_allowance() {
  const define = { 
    'import_folder_id': getProperties("obicCsvFolderId"),
    'import_file_name': getProperties("tsukinTeateCsv"),
  }
  return define
}
// 業務_発令_現職兼務
function define_sub_business() {
  const define = { 
    'import_folder_id': getProperties("obicCsvFolderId"),
    'import_file_name': getProperties("gensyokuKenmuCsv"),
  }
  return define
}
// 業務_発令_発令履歴兼務
function define_proclamation_history() {
  const define = { 
    'import_folder_id': getProperties("obicCsvFolderId"),
    'import_file_name': getProperties("hatsureiRirekiKenmuCsv"),
  }
  return define
}
// 業務_発令_本務経歴
function define_main_hstory() {
  const define = { 
    'import_folder_id': getProperties("obicCsvFolderId"),
    'import_file_name': getProperties("honmuKeirekiCsv"),
  }
  return define
}
// 業務_標準報酬月額
function define_monthly_salary() {
  const define = {
    'import_folder_id': getProperties("obicCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'import_file_name': getProperties("obicCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
  }
  return define
}
// 業務_源泉徴収票
function define_tax_withoutholding() {
  const define = { 
    'import_folder_id': getProperties("obicCsvFolderId"), // OBIC出力CSV格納ディレクトリ
    'import_file_name': getProperties("obicCsvFileName"), // OBIC出力CSV格納ディレクトリファイル名
    'export_folder_id': getProperties("shrCsvFolderId"),　// SHR出力CSV格納ディレクトリ
    'export_file_name': getProperties("shrCsvFileName"), // SHR出力CSV格納ディレクトリ
  }
  return define
}