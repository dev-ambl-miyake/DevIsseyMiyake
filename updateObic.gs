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
          let baseDataList = [];
          let addressDataList = [];
          let familyDataList = [];
          let taxDataList = [];
          let insuranceDataList = [];

          // 連携登録対象の人数分、各CSVファイルを出力
          for(var l = 0; l < employeesData.length; l++) {
            // 対象社員の家族情報を取得
            let familyApiData = callShrFamilyApi(employeesData[l]['id']);

            // 加工が必要な項目
            /* 共通 */
            // 社員番号
            var employeeCode = employeesData[l]['emp_code'].substring(1, 5);

            /* 社員基本 */
            // 氏名
            var name = employeesData[l]['last_name'] + " " + employeesData[l]['first_name'];
            // 氏名カナ
            var nameKana = zenkana2Hankana(employeesData[l]['last_name_yomi'] + " " + employeesData[l]['first_name_yomi']);
            // 旧氏名
            var businessName = employeesData[l]['business_last_name'] + " " + employeesData[l]['business_first_name'];
            // 旧氏名カナ
            if (!employeesData[l]['business_last_name_yomi'] && !employeesData[l]['business_first_name_yomi']) {
              var businessNameKana = null;
            } else if (employeesData[l]['business_last_name_yomi'] && employeesData[l]['business_first_name_yomi']) {
              var businessNameKana = zenkana2Hankana(employeesData[l]['business_last_name_yomi'] + " " + employeesData[l]['business_first_name_yomi']);
            } else {
              var businessNameKana = zenkana2Hankana(employeesData[l]['business_last_name_yomi'] + employeesData[l]['business_first_name_yomi']);
            }
            // 呼称適用
            // 氏名・ビジネスネーム両方が登録されていて、氏名とビジネスネームが一致している場合0 一致していなければ1
            if (employeesData[l]['business_last_name'] && employeesData[l]['business_first_name']) {
              if (name == businessName) {
                var naming = 0;
              } else {
                var naming = 1;
              }
            // 氏名のみ登録されている場合
            } else {
              var naming = 0;
            }
            // 性別区分
            if (employeesData[l]['gender'] == "male") {
              var gender = 1;
            } else if (employeesData[l]['gender'] == "female") {
              var gender = 2;
            }
            // 生年月日
            var birthDate = employeesData[l]['birth_at'].replace(/-/g, '-');
            // 入社年月日
            var enteredDate = employeesData[l]['entered_at'] ? employeesData[l]['entered_at'].replace(/-/g, '-') : null;  // ハイフンをスラッシュに変換
            // 電話番号
            var telNumber = employeesData[l]['tel_number'] ? employeesData[l]['tel_number'] : null;
            // メールアドレス
            var email = employeesData[l]['email'] ? employeesData[l]['email'] : null;

            /* 住所 */
            // 郵便番号(現住所)
            var zipCode = employeesData[l]['address']['zip_code'];
            // 住所1
            var address1 = employeesData[l]['address']['pref'] + employeesData[l]['address']['city'] + employeesData[l]['address']['street'];
            // 住所2
            var address2 = employeesData[l]['address']['building'] ? employeesData[l]['address']['building'] : null;
            // 住所カナ
            // 50文字までは住所カナ1、51文字～は住所カナ2にセット
            var addressKana = employeesData[l]['address']['literal_yomi'] ? zenkana2Hankana(employeesData[l]['address']['literal_yomi']) : null
            if (addressKana) {
              if (addressKana.length > 50) {
                var addressKana1 = addressKana.substring(0, 50);
                var addressKana2 = addressKana.substring(50);
              } else {
                var addressKana1 = addressKana;
                var addressKana2 = "";
              }
            } else {
              var addressKana1 = null;
              var addressKana2 = null;
            }
            // 郵便番号(住民票住所)
            var residentCardZipCode = employeesData[l]['resident_card_address'] ? employeesData[l]['resident_card_address']['zip_code'] : null;
            // 住民票住所1
            var residentCardAddress1 = employeesData[l]['resident_card_address'] ? employeesData[l]['resident_card_address']['pref'] + employeesData[l]['resident_card_address']['city'] + employeesData[l]['resident_card_address']['street'] : null;
            // 住民票住所2
            var residentCardAddress2 = employeesData[l]['resident_card_address']['building'] ? employeesData[l]['resident_card_address']['building'] : null;
            // 住民票住所カナ
            // 50文字までは住所カナ1、51文字～は住所カナ2にセット
            var residentCardAddressKana = employeesData[l]['resident_card_address']['literal_yomi'] ? zenkana2Hankana(employeesData[l]['resident_card_address']['literal_yomi']) : null;
            if (residentCardAddressKana) {
              if (residentCardAddressKana.length > 50) {
                var residentCardAddressKana1 = residentCardAddressKana.substring(0, 50);
                var residentCardAddressKana2 = residentCardAddressKana.substring(50);
              } else {
                var residentCardAddressKana1 = residentCardAddressKana;
                var residentCardAddressKana2 = "";
              }
            } else {
              var residentCardAddressKana1 = null;
              var residentCardAddressKana2 = null;
            }

            // 住民票区分
            if (residentCardAddress1) {
              // 住所・住民票住所の丁目番地までの文字列を照合
              if (zenkana2Hankana(address1) == zenkana2Hankana(residentCardAddress1)) {
                var residentCardType = 1;
              } else {
                var residentCardType = 0;
              }
            // 住民票住所の登録が無い場合
            } else {
              var residentCardType = 0;
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
                'lastNameKana' : familyApiData[fl]['last_name_yomi'] ? familyApiData[fl]['last_name_yomi'] : null,
                // 家族名カナ
                'firstNameKana' : familyApiData[fl]['first_name_yomi'] ? familyApiData[fl]['first_name_yomi'] : null,
                // 性別区分
                'gender' : familyApiData[fl]['gender'] == "male" ? 1 : 2,
                // 生年月日
                'birthDate' : familyApiData[fl]['birth_at'] ? familyApiData[fl]['birth_at'].replace(/-/g, '-') : null,
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
                extractedFamilyDataList[fl]['zipCode'] = employeesData[l]['address']['zip_code'];
                extractedFamilyDataList[fl]['address1'] = employeesData[l]['address']['pref'] + employeesData[l]['address']['city'] + employeesData[l]['address']['street'];
                extractedFamilyDataList[fl]['address2'] = employeesData[l]['address']['building'];
              // 別居の場合、別居先住所を登録、登録が無ければブランク
              } else {
                extractedFamilyDataList[fl]['liveTogetherType'] = 0;
                extractedFamilyDataList[fl]['zipCode'] = familyApiData[fl]['address']['zip_code'];
                extractedFamilyDataList[fl]['address1'] = familyApiData[fl]['address']['pref'] + familyApiData[fl]['address']['city'] + familyApiData[fl]['address']['street'];
                extractedFamilyDataList[fl]['address2'] = familyApiData[fl]['address']['building'];
              }
            }

            /* 税表区分 */
            // 課税区分
            if (employeesData[l]['tax_cd'] == "kou") {
              var taxCategory = 1;
            } else if (employeesData[l]['tax_cd'] == "otsu") {
              var taxCategory = 2;
            } else {
              var taxCategory = 1;  // 1,2の値のみ扱うため、それら以外の値は一律1(甲)となるよう値をセット
            }
            // 障害区分
            if (!employeesData[l]['handicapped_type']) {
              var handicappedType = 0;
            } else if (employeesData[l]['handicapped_type'] == "ordinary_handicapped ") {
              var handicappedType = 1;
            } else {
              var handicappedType = 2;
            }

            /* 社会保険 */
            // 基礎年金番号1
            var basicPensionNumber1 = employeesData[l]['basic_pension_number'] ? employeesData[l]['basic_pension_number'].substring(0, 4) : null;
            // 基礎年金番号2
            var basicPensionNumber2 = employeesData[l]['basic_pension_number'] ? employeesData[l]['basic_pension_number'].substring(5, 11) : null;
            // 雇用保険番号1
            var insuredPersonNumber1 = employeesData[l]['emp_ins_insured_person_number'] ? employeesData[l]['emp_ins_insured_person_number'].substring(0, 4) : null;
            // 雇用保険番号2
            var insuredPersonNumber2 = employeesData[l]['emp_ins_insured_person_number'] ? employeesData[l]['emp_ins_insured_person_number'].substring(5, 11) : null;
            // 雇用保険番号3
            var insuredPersonNumber3 = employeesData[l]['emp_ins_insured_person_number'] ? employeesData[l]['emp_ins_insured_person_number'].substring(12, 13) : null;
            
            // 社員基本_配列に値をセット
            let baseData = [
              "100",  // データ区分(固定値)
              employeeCode,  // 社員番号
              name,  // 氏名
              nameKana,  // 氏名カナ(半角)
              naming,  // 呼称適用 0:氏名を呼称として使用, 1:旧氏名を呼称として使用
              businessName,  // 旧氏名
              businessNameKana,  // 旧氏名カナ(半角)
              gender,  // 性別区分 0:不明、1:男、2:女
              birthDate,  // 生年月日
              enteredDate,  // 入社年月日
              telNumber,  // 電話番号
              email  // メールアドレス
            ]
            baseDataList.push(baseData);

            // 住所_配列に値をセット
            // 住民票区分が"1:住民票住所"の場合
            if (residentCardType == 1) {
              let addressData = [
                "111",  // データ区分(固定値)
                employeeCode,  // 社員番号
                enteredDate,  // 入居年月日(入社日の値を入れる)
                residentCardType,  // 住民票区分 0:住民票住所でない, 1:住民票住所
                zipCode,  // 郵便番号
                address1,  // 住所1
                address2,  // 住所2
                addressKana1,  // 住所1カナ
                addressKana2,  // 住所2カナ
                telNumber,  // 電話番号
                null,  // 社員SEQ(値の入力は不要)
                1  // 現住所区分  0:現住所でない 1:現住所
              ]
              addressDataList.push(addressData);
            // 住民票区分が"0:住民票住所でない"の場合
            } else {
              let addressData1 = [
                "111",  // データ区分(固定値)
                employeeCode,  // 社員番号
                enteredDate,  // 入居年月日(入社日の値を入れる)
                1,  // 住民票区分 0:住民票住所でない, 1:住民票住所
                residentCardZipCode,  // 郵便番号
                residentCardAddress1,  // 住所1
                residentCardAddress2,  // 住所2
                residentCardAddressKana1,  // 住所1カナ
                residentCardAddressKana2,  // 住所2カナ
                null,  // 電話番号
                null,  // 社員SEQ(値の入力は不要)
                0  // 現住所区分
              ];
              let addressData2 = [
                "111",  // データ区分(固定値)
                employeeCode,  // 社員番号
                enteredDate,  // 入居年月日(入社日の値を入れる)
                0,  // 住民票区分 0:住民票住所でない, 1:住民票住所
                zipCode,  // 郵便番号
                address1,  // 住所1
                address2,  // 住所2
                addressKana1,  // 住所1カナ
                addressKana2,  // 住所2カナ
                telNumber,  // 電話番号
                null,  // 社員SEQ(値の入力は不要)
                1  // 現住所区分
              ]
              addressDataList.push(addressData1);
              addressDataList.push(addressData2);
            }
            
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

            // 税表区分_配列に値をセット
            let taxData = [
              "103",  // データ区分(固定値)
              employeeCode,  // 社員番号
              taxCategory,  // 税表区分 1:甲, 2:乙, 3:定率, 4:定額, 5:税なし
              handicappedType,  // 障害区分 0:対象外, 1：一般, 2：特別
            ]
            taxDataList.push(taxData);

            // 社会保険_配列に値をセット
            let insuranceData = [
              "102",  // データ区分(固定値)
              employeeCode,  // 社員番号
              basicPensionNumber1,  // 基礎年金番号1
              basicPensionNumber2,  // 基礎年金番号2
              insuredPersonNumber1,  // 雇用保険番号1
              insuredPersonNumber2,  // 雇用保険番号2
              insuredPersonNumber3,  // 雇用保険番号3
            ]
            insuranceDataList.push(insuranceData);
          }

          // CSVファイル出力先ドライブフォルダ内に既に存在するファイルを削除
          deleteCsv(getProperties("obicExportCsvFolderId"));

          // CSVファイル出力
          export_csv(baseDataList, operation_type = 2.1);
          export_csv(addressDataList, operation_type = 2.2);
          export_csv(familyDataList, operation_type = 2.3);
          export_csv(taxDataList, operation_type = 2.4);
          export_csv(insuranceDataList, operation_type = 2.5);

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
    "。": "｡", "、": "､", "ー": "ｰ", "「": "｢", "」": "｣", "・": "･"
  }
  var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');

  return str.replace(reg,
    function (match) {
      return kanaMap[match];
  }).replace(/゛/g, 'ﾞ').replace(/゜/g, 'ﾟ');
}
