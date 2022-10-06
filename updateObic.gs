function updateObic() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let lastRow = sheet.getLastRow();  //最終行を取得
  let headerLine = 8;  //ヘッダーの行数

  //社員情報が表示されている場合のみ実行
  if(lastRow > headerLine) {
    let checkValue = getCheckValue();

    //チェックボックスにチェックが付いている場合のみ実行
    if(checkValue.length > 0){
      let idList = getSmarthrId(checkValue);
      
      //idが存在した場合のみ実行
      if(idList.length > 0) {

        let getData = getEmployee(idList);
        let familyDate = getFamiliy(idList);
        let changedDate = changeDate(getData, familyDate);
        
        let addressList = [];
        let bankList = [];
        let nameList = [];
        let familyList = [];

        // try{
          // 開始ログ
          commonFunction.log('更新OBIC用CSV作成', 's');

          for(var i = 0; i < changedDate.length; i++) {
            //"データ区分", "社員コード", "入居年月日", "住民票区分", "郵便番号", "住所1", "住所2", "住所1カナ", "住所2カナ", "電話番号", "社員SEQ", "現住所区分"
            
            let present_address = changedDate[i].presentAddress_prefectures + changedDate[i].presentAddress_municipalities + changedDate[i].presentAddress_houseNumber;
            let resident_address = changedDate[i].residentAddress_prefectures + changedDate[i].residentAddress_municipalities + changedDate[i].residentAddress_houseNumber;

            //現住所
            let address_present = [
              "111",
              "'" + changedDate[i].code.slice(-4),
              "入居年月日",
              0,
              changedDate[i].presentAddress_postalCode,
              present_address,
              changedDate[i].presentAddress_roomNumber,
              changedDate[i].pressentAddress_yomi,
              "",
              changedDate[i].tel,
              "",
              1
            ]
            //住民票住所
            let address_residential = [
              "111",
              "'" + changedDate[i].code.slice(-4),
              "入居年月日",
              1,
              changedDate[i].residentAddress_postalCode,
              resident_address,
              changedDate[i].residentAddress_roomNumber,
              changedDate[i].residentAddress_yomi,
              "", changedDate[i].tel, "",
              present_address + changedDate[i].presentAddress_roomNumber === resident_address + changedDate[i].residentAddress_roomNumber ? 1 : 0
            ]

            //口座情報
            //"データ区分", "コード", "振込銀行区分", "口座SEQ", "振込依頼銀行コード", "振込銀行コード", "振込支店コード", "口座種別", "口座番号", "名義人漢字", "名義人ｶﾅ", "新規コード", "定値"
            let main_bank = [
              "875",
              "'" + changedDate[i].code.slice(-4),
              0,
              1,
              changedDate[i].bankCode === "0009" ? 1 : changedDate[i].bankCode === "0001" ? 3 : changedDate[i].bankCode === "0005" ? 2 : 1,
              changedDate[i].bankCode,
              changedDate[i].branchCode,
              changedDate[i].depositType === "saving" ? 1 : changedDate[i].depositType === "checking" ? 2 : "",
              changedDate[i].accountNumber,
              changedDate[i].last_name + changedDate[i].first_name,
              changedDate[i].accountName !== null ? zenkana2Hankana(changedDate[i].accountName) : "",
              0,
              0
            ]

            let bonus_bank = [
              "875",
              "'" + changedDate[i].code.slice(-4),
              1,
              1,
              changedDate[i].bankCode === "0009" ? 1 : changedDate[i].bankCode === "0001" ? 3 : changedDate[i].bankCode === "0005" ? 2 : 1,
              changedDate[i].bankCode,
              changedDate[i].branchCode,
              changedDate[i].depositType === "saving" ? 1 : changedDate[i].depositType === "checking" ? 2 : "",
              changedDate[i].accountNumber,
              changedDate[i].last_name + changedDate[i].first_name,
              changedDate[i].accountName !== null ? zenkana2Hankana(changedDate[i].accountName) : "",
              0,
              0
            ]

            //氏名
            //"データ区分", "社員コード", "氏名", "氏名ｶﾅ", "呼称適用", "旧氏名", "旧氏名ｶﾅ", "性別区分", "生年月日", "入社年月日", "携帯電話番号", "メールアドレス"
            let name = [
              "100",
              "'" + changedDate[i].code.slice(-4),
              changedDate[i].last_name + "　" + changedDate[i].first_name,
              zenkana2Hankana(changedDate[i].last_name_kana + " " + changedDate[i].first_name_kana),
              changedDate[i].name !== null ? (changedDate[i].last_name + "　" + changedDate[i].first_name !== changedDate[i].name ? 1 : 0): 0,
              changedDate[i].name,
              zenkana2Hankana(changedDate[i].name_kana),
              changedDate[i].gender === "男性" ? 1 : changedDate[i].gender === "女性" ? 2 : 0,
              changedDate[i].birthday.replace(/-/g, "/"),
              "",
              changedDate[i].tel,
              changedDate[i].mail
            ]

            //家族
            // "データ区分", "社員コード", "続柄", "家族姓", "家族名", "家族姓カナ", "家族名カナ", "性別区分", "生年月日", "税扶養区分", "配偶者区分", "同居区分", "障害区分", "健康保険区分", "郵便番号", "住所1", "住所2", "電話番号", "社員SEQ"
            let family = [
              "107",
              "'" + changedDate[i].code.slice(-4),
              changedDate[i].family_relationship1,
              changedDate[i].family_lastName1,
              changedDate[i].family_firstName1,
              changedDate[i].family_lastName1_kana !== null ? zenkana2Hankana(changedDate[i].family_lastName1_kana) : "",
              changedDate[i].family_firstName1_kana !== null ? zenkana2Hankana(changedDate[i].family_firstName1_kana) : "",
              changedDate[i].family_gender1 === "male" ? 1 : changedDate[i].family_gender1 === "female" ? 2 : 0,
              changedDate[i].family_birthday1 !== null ? changedDate[i].family_birthday1.replace(/-/g, "/") : "",
              changedDate[i].family_tax_law_support_type1 === "unsupported" ? 0 : changedDate[i].family_tax_law_support_type1 === "supported" ? 1 : "",
              changedDate[i].family_is_spouse1 === true ? 1 : changedDate[i].family_is_spouse1 === false ? 1 : "",
              changedDate[i].living_together1 === "living_separately" ? 0 : changedDate[i].living_together1 === "living_together" ? 1 : "",
              changedDate[i].family_handicapped_type1 === "ordinary_handicapped" ? 1 : changedDate[i].family_handicapped_type1 === "special_handicapped" ? 2 : changedDate[i].family_handicapped_type1 === null ? 0 : "",
              changedDate[i].family_social_insurance_support_type1 === "unsupported" ? 0 : changedDate[i].family_social_insurance_support_type1 === "supported" ? 1 : "",
              changedDate[i].family_postalCode1,
              changedDate[i].family_prefectures1 + changedDate[i].family_municipalities1 + changedDate[i].family_houseNumber1,
              changedDate[i].family_roomNumber1,
              changedDate[i].family_tel1,
              ""
            ]
            
            addressList.push(address_present)
            addressList.push(address_residential)
            bankList.push(main_bank)
            bankList.push(bonus_bank)
            nameList.push(name)
            familyList.push(family)
          }

          commonFunction.export_csv(addressList, operation_type = 2.1);
          commonFunction.export_csv(bankList, operation_type = 2.2);
          commonFunction.export_csv(nameList, operation_type = 2.3);
          commonFunction.export_csv(familyList, operation_type = 2.4);

          //ステータスを済に変更
          changeStatus(2);
          // 終了ログ
  　      commonFunction.log('更新OBIC用CSV作成', 'e');

          SpreadsheetApp.getUi().alert("OBIC用CSVの出力が終了しました。");
        // }catch(e) {
        //   SpreadsheetApp.getUi().alert("OBIC用CSVの出力に失敗しました。");
        // }
      }
    }
  }
}

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
    return str
            .replace(reg, function (match) {
                return kanaMap[match];
            })
            .replace(/゛/g, 'ﾞ')
            .replace(/゜/g, 'ﾟ');
}
