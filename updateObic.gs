/**
 * 変更申請_SmartHRからOBICへの社員情報連携更新処理
 * 
 * 更新対象社員選択_スプレッドシートで選択された社員情報と、
 * SmartHRに登録されている社員情報の社員番号を参照値として照合し、
 * 一致した社員情報をSmartHR_APIより取得しOBIC取り込み用CSVファイルとして出力する
 */
function updateObic() {
  try {
    var work = "変更申請_OBIC連携登録";

    // 開始ログ
    log(work, 's');

    // 更新対象社員選択_スプレッドシート情報の取得
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getActiveSheet();
    let lastRow = sheet.getLastRow();  //最終行を取得
    let headerLine = 8;  //ヘッダーの行数

    // 更新対象社員選択シートに社員情報が存在していたら
    if(lastRow > headerLine) {
      // 選択されている社員情報行のみを抽出
      let selectedEmployeeList = getSelectedRow();

      // 更新対象の社員情報が存在していたら
      if(selectedEmployeeList.length > 0) {
        // SmartHR_APIから社員情報を全件取得し、社員番号を照合
        let employeeCodeList = checkEmployeeCode(selectedEmployeeList);

        if(employeeCodeList.length > 0) {
          // 更新対象社員情報一覧を取得
          const employeesData = getEmployeeList(employeeCodeList);

          // OBIC連携登録CSV出力_データ格納用配列変数
          let familyDataList = [];
          let bankDataList = [];

          // 連携登録対象の人数分、各CSVファイルを出力
          for(var l = 0; l < employeesData.length; l++) {
            // 対象社員の家族情報を取得
            let familyApiData = callShrFamilyApi(employeesData[l]['id']);

            // 加工が必要な項目
            // 社員番号
            var employeeCode = employeesData[l]['emp_code'].substring(1, 5);
            // 氏名
            var name = employeesData[l]['last_name'] + "　" + employeesData[l]['first_name'];
            // 郵便番号(現住所)
            var zipCode = employeesData[l]['address']['zip_code'];
            // 住所1
            var address1 = employeesData[l]['address']['pref'] + employeesData[l]['address']['city'] + employeesData[l]['address']['street'];
            // 住所2
            if (employeesData[l]['address'] && employeesData[l]['address']['building']) {
              var address2 = employeesData[l]['address']['building'];
            } else {
              var address2 = null;
            }

            /* 家族 */
            // 対象社員に登録されている家族人数分、CSVに出力する
            var extractedFamilyDataList = [];
            for(var fl = 0; fl < familyApiData.length; fl++) {
              extractedFamilyDataList[fl] = {
                // 続柄
                'relationship' : familyApiData[fl]['relation_name'] ? familyApiData[fl]['relation_name'] : null,
                // 家族姓
                'lastName' : familyApiData[fl]['last_name'] ? familyApiData[fl]['last_name'] : null,
                // 家族名
                'firstName' : familyApiData[fl]['first_name'] ? familyApiData[fl]['first_name'] : null,
                // 家族姓カナ
                'lastNameKana' : familyApiData[fl]['last_name_yomi'] ? zenkana2Hankana(familyApiData[fl]['last_name_yomi']) : null,
                // 家族名カナ
                'firstNameKana' : familyApiData[fl]['first_name_yomi'] ? zenkana2Hankana(familyApiData[fl]['first_name_yomi']) : null,
                // 性別区分
                'gender' : familyApiData[fl]['gender'] == "male" ? 1 : 2,
                // 生年月日
                'birthDate' : familyApiData[fl]['birth_at'] ? familyApiData[fl]['birth_at'].replace(/-/g, '/') : null,
                // 税扶養区分
                // 税法上の扶養状況が扶養されている場合1, 扶養されていない、又は配偶者特別控除対象者、又は不明の場合0
                'taxLawSupportType' : familyApiData[fl]['tax_law_support_type'] == "supported" ? 1 : 0,
                // 健康保険区分
                // 社会保険の扶養状況が扶養されている場合1, 扶養されていない、又は不明の場合0
                'socialInsuranceSupportType' : familyApiData[fl]['social_insurance_support_type'] == "supported" ? 1 : 0,
                // 配偶者区分
                'isSpouse' : familyApiData[fl]['is_spouse'] ? 1 : 0,
                // 電話番号
                'telNumber' : familyApiData[fl]['tel_number'] ? familyApiData[fl]['tel_number'] : null,
              }
              // 障害区分
              // 登録値なし
              if (!familyApiData[fl]['handicapped_type']) {
                extractedFamilyDataList[fl]['handicappedType'] = 0;
              // 一般の障害者
              } else if (familyApiData[fl]['handicapped_type'] == "ordinary_handicapped") {
                extractedFamilyDataList[fl]['handicappedType'] = 1;
              // 特別障害者・同居特別障害者
              } else {
                extractedFamilyDataList[fl]['handicappedType'] = 2;
              }
              // 同居区分、及び判定に伴う郵便番号・住所1・住所2
              // 同居の場合、対象社員の現住所を登録
              if (familyApiData[fl]['live_together_type'] == "living_together") {
                extractedFamilyDataList[fl]['liveTogetherType'] = 1;
                extractedFamilyDataList[fl]['zipCode'] = zipCode;
                extractedFamilyDataList[fl]['address1'] = address1;
                extractedFamilyDataList[fl]['address2'] = address2;
              // 別居の場合、別居先住所を登録、登録が無ければブランク
              } else {
                extractedFamilyDataList[fl]['liveTogetherType'] = 0;
                extractedFamilyDataList[fl]['zipCode'] = familyApiData[fl]['address'] ? familyApiData[fl]['address']['zip_code'] : null;
                extractedFamilyDataList[fl]['address1'] = familyApiData[fl]['address'] ? familyApiData[fl]['address']['pref'] + familyApiData[fl]['address']['city'] + familyApiData[fl]['address']['street'] : null;
                if (familyApiData[fl]['address'] && familyApiData[fl]['address']['building']) {
                  extractedFamilyDataList[fl]['address2'] = familyApiData[fl]['address']['building'];
                } else {
                  extractedFamilyDataList[fl]['address2'] = null;
                }
              }
            }

            /* 銀行 */
            // 振込依頼銀行コード
            if (employeesData[l]['bank_accounts'][0]['bank_code']) {
              // 三菱UFJ
              if (employeesData[l]['bank_accounts'][0]['bank_code'] == "0005") {
                var transferBankCode = 2;
              // みずほ
              } else if (employeesData[l]['bank_accounts'][0]['bank_code'] == "0001") {
                var transferBankCode = 3;
              // 三菱UFJ・みずほ以外
              } else {
                var transferBankCode = 1;
              }
            } else {
              var transferBankCode = null;
            }
            // 振込銀行コード
            var bankCode = employeesData[l]['bank_accounts'][0]['bank_code'] ? employeesData[l]['bank_accounts'][0]['bank_code'] : null;
            // 振込支店コード
            var branchCode = employeesData[l]['bank_accounts'][0]['bank_branch_code'] ? employeesData[l]['bank_accounts'][0]['bank_branch_code'] : null;
            // 口座種別
            if (employeesData[l]['bank_accounts'][0]['account_type']) {
              // 普通
              if (employeesData[l]['bank_accounts'][0]['account_type'] == "saving") {
                var accountType = 1;
              // 当座
              } else if (employeesData[l]['bank_accounts'][0]['account_type'] == "checking ") {
                var accountType = 2;
              // 貯蓄
              } else {
                var accountType = 3;
              }
            } else {
              var accountType = null;
            }
            // 口座番号
            var account_number = employeesData[l]['bank_accounts'][0]['account_number'] ? employeesData[l]['bank_accounts'][0]['account_number'] : null;
            // 名義人ｶﾅ
            var accountHolderName = employeesData[l]['bank_accounts'][0]['account_holder_name'] ? zenkana2Hankana(employeesData[l]['bank_accounts'][0]['account_holder_name']) : null;
            
            // 家族_配列に値をセット
            for(var efl = 0; efl < extractedFamilyDataList.length; efl++) {
              let familyData = [
                "107",  // データ区分(固定値)
                employeeCode,  // 社員番号
                extractedFamilyDataList[efl]['relationship'],  // 続柄
                extractedFamilyDataList[efl]['lastName'],  // 家族姓
                extractedFamilyDataList[efl]['firstName'],  // 家族名
                extractedFamilyDataList[efl]['lastNameKana'],  // 家族姓カナ
                extractedFamilyDataList[efl]['firstNameKana'],  // 家族名カナ
                extractedFamilyDataList[efl]['gender'],  // 性別区分 1：男, 2：女
                extractedFamilyDataList[efl]['birthDate'],  // 生年月日
                extractedFamilyDataList[efl]['taxLawSupportType'],  // 税扶養区分 0:対象外, 1:対象
                extractedFamilyDataList[efl]['isSpouse'],  // 配偶者区分 0:配偶者以外, 1:配偶者
                extractedFamilyDataList[efl]['liveTogetherType'],  // 同居区分 0:別居, 1:同居
                extractedFamilyDataList[efl]['handicappedType'],  // 障害区分 0:対象外, 1：一般, 2：特別
                extractedFamilyDataList[efl]['socialInsuranceSupportType'],  // 健康保険区分 0:対象外, 1:対象
                extractedFamilyDataList[efl]['zipCode'],  // 郵便番号
                extractedFamilyDataList[efl]['address1'],  // 住所1
                extractedFamilyDataList[efl]['address2'],  // 住所2
                extractedFamilyDataList[efl]['telNumber'],  // 電話番号
                null  // 社員SEQ(値の入力は不要)
              ]
              familyDataList.push(familyData);
            }

            // 銀行_配列に値をセット
            let bankData1 = [
              "875",  // データ区分(固定値)
              employeeCode,  // 社員番号
              0,  // 振込銀行区分 0:給与,1:賞与
              1,  // 口座SEQ
              transferBankCode,  // 振込依頼銀行コード 三菱UFJ,みずほ以外の銀行コード:1,三菱UFJ：2,みずほ：3,
              bankCode,  // 振込銀行コード
              branchCode, // 振込支店コード
              accountType, // 口座種別 1:普通,2:当座,3:預り金
              account_number, // 口座番号
              name,  // 名義人漢字
              accountHolderName,  // 名義人ｶﾅ
              0,  // 新規コード
              0,  // 定額
            ]
            let bankData2 = [
              "875",  // データ区分(固定値)
              employeeCode,  // 社員番号
              1,  // 振込銀行区分 0:給与,1:賞与
              1,  // 口座SEQ
              transferBankCode,  // 振込依頼銀行コード 三菱UFJ,みずほ以外の銀行コード:1,三菱UFJ：2,みずほ：3,
              bankCode,  // 振込銀行コード
              branchCode, // 振込支店コード
              accountType, // 口座種別 1:普通,2:当座,3:預り金
              account_number, // 口座番号
              name,  // 名義人漢字
              accountHolderName,  // 名義人ｶﾅ
              0,  // 新規コード
              0,  // 定額
            ]
            bankDataList.push(bankData1);
            bankDataList.push(bankData2);
          }

          // CSVファイル出力先ドライブフォルダ内に既に存在するファイルを削除
          deleteCsv(getProperties("obicExportCsvFolderId"));

          // CSVファイル出力
          export_csv(familyDataList, operation_type = 2.3);
          export_csv(bankDataList, operation_type = 2.6);

          // 連携ステータスを済に変更
          changeStatus(2);

          // 終了ログ
  　      log(work, 'e');
          SpreadsheetApp.getUi().alert("OBIC用CSVの出力が終了しました。");
        }
      } else {
        SpreadsheetApp.getUi().alert("チェックがついている社員情報がありません。\n更新したい社員情報行にチェックをつけてください。");
      }
    } else {
      SpreadsheetApp.getUi().alert("社員情報が存在しません。");
    }
  } catch (e) {
    log(work + "[エラーログ]", "s");
    log(e.message, "error");
    log(work + "[エラーログ]", "e");
    SpreadsheetApp.getUi().alert("OBIC用CSVの出力に失敗しました。");
  }
}

/**
 * 全角文字を半角文字に変換し呼び出し元へ返却する
 * 
 * string str
 * return string
 */
function zenkana2Hankana(str) {
  var kanaMap = {
    "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
    "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
    "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
    "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
    "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
    "ヴ": "ｳﾞ", "ヷ": "ﾜﾞ", "ヺ": "ｦﾞ",
    "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
    "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
    "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
    "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
    "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
    "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
    "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
    "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
    "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
    "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
    "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
    "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
    "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･", "　": " ",
  }

  // 英数記号を変換
  var convertedAlphanumericAndSymbol = str.replace(/[！-～]/g,
    function( tmpStr ) {
      // 文字コードをシフト
      return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
    }
  );
  // 文字コードシフトで対応できない文字の変換
  convertedAlphanumericAndSymbol.replace(/”/g, "\"")
    .replace(/’/g, "'")
    .replace(/‘/g, "`")
    .replace(/￥/g, "\\")
    .replace(/〜/g, "~");

  // 英数字以外を変換
  var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');

  return convertedAlphanumericAndSymbol.replace(reg,
    function (match) {
      return kanaMap[match];
  }).replace(/゛/g, 'ﾞ').replace(/゜/g, 'ﾟ');
}
