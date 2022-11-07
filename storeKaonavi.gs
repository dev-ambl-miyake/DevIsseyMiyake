/**
 * 入社_SmartHRからカオナビへの社員情報連携登録処理
 * 
 * 社員番号入力_スプレッドシートに入力された社員番号と、
 * 履歴データ[登録用]_スプレッドシートに記載されている社員番号を照合し、
 * 一致した社員情報をSmartHR_APIより取得しカオナビへ登録する
 */
function createMember() {
  try {
    var work = "入社_カオナビ連携登録";

    // 開始ログ
    log(work, 's');

    // カオナビ_シート名定義
    const kaonaviContactSheetName = "連絡先";
    const kaonaviAddressSheetName = "現住所";
    const kaonaviEmergencyContactSheetName = "緊急連絡先";
    const kaonaviBankSheetName = "銀行口座";
    const kaonaviAcademicSheetName = "学歴";
    const kaonaviLanguageSheetName = "語学";
    const kaonaviLicenseSheetName = "免許・資格等";
    const kaonaviFamilySheetName = "家族情報";

    /* カオナビ_各シート情報を参照取得 */
    // シート_基本情報
    var basicInfoSheetData = [];
    for (var basicInfoSheetKey = 0; basicInfoSheetKey < member_sheets_api['custom_fields'].length; basicInfoSheetKey++) {
      if (member_sheets_api['custom_fields'][basicInfoSheetKey]['name'] == "採用形態") {
        basicInfoSheetData['recruitment'] = member_sheets_api['custom_fields'][basicInfoSheetKey]['id'];
      }
    }
    const basicInfoSheetIdList = {
      'recruitment' : basicInfoSheetData['recruitment'],
    }
    // シート_連絡先
    const contactSheetList = checkSheetName(sheets_list, kaonaviContactSheetName);
    var contactSheetData = [];
    for (var contactSheetKey = 0; contactSheetKey < contactSheetList['custom_fields'].length; contactSheetKey++) {
      if (contactSheetList['custom_fields'][contactSheetKey]['name'] == "メールアドレス") {
        contactSheetData['email'] = contactSheetList['custom_fields'][contactSheetKey]['id'];
      }
      if (contactSheetList['custom_fields'][contactSheetKey]['name'] == "電話番号") {
        contactSheetData['telNumber'] = contactSheetList['custom_fields'][contactSheetKey]['id'];
      }
    }
    const contactSheetIdList = {
      'sheetId' : contactSheetList['id'],
      'email' : contactSheetData['email'],
      'telNumber' : contactSheetData['telNumber'],
    }
    // シート_現住所
    const addressSheetList = checkSheetName(sheets_list, kaonaviAddressSheetName);
    var addressSheetData = [];
    for (var academicSheetKey = 0; academicSheetKey < addressSheetList['custom_fields'].length; academicSheetKey++) {
      if (addressSheetList['custom_fields'][academicSheetKey]['name'] == "郵便番号") {
        addressSheetData['zipCode'] = addressSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (addressSheetList['custom_fields'][academicSheetKey]['name'] == "市区町村") {
        addressSheetData['city'] = addressSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (addressSheetList['custom_fields'][academicSheetKey]['name'] == "丁目・番地") {
        addressSheetData['street'] = addressSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (addressSheetList['custom_fields'][academicSheetKey]['name'] == "建物名・部屋番号") {
        addressSheetData['building'] = addressSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (addressSheetList['custom_fields'][academicSheetKey]['name'] == "国コード") {
        addressSheetData['countryNumber'] = addressSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (addressSheetList['custom_fields'][academicSheetKey]['name'] == "都道府県") {
        addressSheetData['pref'] = addressSheetList['custom_fields'][academicSheetKey]['id'];
      }
    }
    const addressSheetIdList = {
      'sheetId' : addressSheetList['id'],
      'zipCode' : addressSheetData['zipCode'],
      'city' : addressSheetData['city'],
      'street' : addressSheetData['street'],
      'building' : addressSheetData['building'],
      'countryNumber' : addressSheetData['countryNumber'],
      'pref' : addressSheetData['pref'],
    }
    // シート_緊急連絡先
    const emergencyContactSheetList = checkSheetName(sheets_list, kaonaviEmergencyContactSheetName);
    var emergencyContactSheetData = [];
    for (var emergencyContactSheetKey = 0; emergencyContactSheetKey < emergencyContactSheetList['custom_fields'].length; emergencyContactSheetKey++) {
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "続柄") {
        emergencyContactSheetData['relationName'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "氏名") {
        emergencyContactSheetData['name'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "氏名カナ") {
        emergencyContactSheetData['nameKana'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "電話番号") {
        emergencyContactSheetData['telNumber'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "郵便番号") {
        emergencyContactSheetData['zipCode'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "都道府県") {
        emergencyContactSheetData['pref'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "市区町村") {
        emergencyContactSheetData['city'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "丁目・番地") {
        emergencyContactSheetData['street'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
      if (emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['name'] == "建物名・部屋番号") {
        emergencyContactSheetData['building'] = emergencyContactSheetList['custom_fields'][emergencyContactSheetKey]['id'];
      }
    }
    const emergencyContactSheetIdList = {
      'sheetId' : emergencyContactSheetList['id'],
      'relationName' : emergencyContactSheetData['relationName'],
      'name' : emergencyContactSheetData['name'],
      'nameKana' : emergencyContactSheetData['nameKana'],
      'telNumber' : emergencyContactSheetData['telNumber'],
      'zipCode' : emergencyContactSheetData['zipCode'],
      'pref' : emergencyContactSheetData['pref'],
      'city' : emergencyContactSheetData['city'],
      'street' : emergencyContactSheetData['street'],
      'building' : emergencyContactSheetData['building'],
    }
    // 銀行口座
    const bankSheetList = checkSheetName(sheets_list, kaonaviBankSheetName);
    var bankSheetData = [];
    for (var bankSheetKey = 0; bankSheetKey < bankSheetList['custom_fields'].length; bankSheetKey++) {
      if (bankSheetList['custom_fields'][bankSheetKey]['name'] == "銀行コード") {
        bankSheetData['bankCode'] = bankSheetList['custom_fields'][bankSheetKey]['id'];
      }
      if (bankSheetList['custom_fields'][bankSheetKey]['name'] == "支店コード") {
        bankSheetData['bankBranchCode'] = bankSheetList['custom_fields'][bankSheetKey]['id'];
      }
      if (bankSheetList['custom_fields'][bankSheetKey]['name'] == "預金種別") {
        bankSheetData['accountType'] = bankSheetList['custom_fields'][bankSheetKey]['id'];
      }
      if (bankSheetList['custom_fields'][bankSheetKey]['name'] == "口座番号") {
        bankSheetData['accountNumber'] = bankSheetList['custom_fields'][bankSheetKey]['id'];
      }
      if (bankSheetList['custom_fields'][bankSheetKey]['name'] == "名義（カタカナ）") {
        bankSheetData['accountHolderName'] = bankSheetList['custom_fields'][bankSheetKey]['id'];
      }
    }
    const bankSheetIdList = {
      'sheetId' : bankSheetList['id'],
      'bankCode' : bankSheetData['bankCode'],
      'bankBranchCode' : bankSheetData['bankBranchCode'],
      'accountType' : bankSheetData['accountType'],
      'accountNumber' : bankSheetData['accountNumber'],
      'accountHolderName' : bankSheetData['accountHolderName'],
    }
    // 学歴
    const academicSheetList = checkSheetName(sheets_list, kaonaviAcademicSheetName);
    var academicSheetData = [];
    for (var academicSheetKey = 0; academicSheetKey < academicSheetList['custom_fields'].length; academicSheetKey++) {
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校1_学校分類") {
        academicSheetData['schoolCategory1'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校2_学校分類") {
        academicSheetData['schoolCategory2'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校3_学校分類") {
        academicSheetData['schoolCategory3'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校4_学校分類") {
        academicSheetData['schoolCategory4'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校5_学校分類") {
        academicSheetData['schoolCategory5'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校1_学校名") {
        academicSheetData['schoolName1'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校2_学校名") {
        academicSheetData['schoolName2'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校3_学校名") {
        academicSheetData['schoolName3'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校4_学校名") {
        academicSheetData['schoolName4'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校5_学校名") {
        academicSheetData['schoolName5'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校1_学部・学科・コース") {
        academicSheetData['schoolDepartment1'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校2_学部・学科・コース") {
        academicSheetData['schoolDepartment2'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校3_学部・学科・コース") {
        academicSheetData['schoolDepartment3'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校4_学部・学科・コース") {
        academicSheetData['schoolDepartment4'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校5_学部・学科・コース") {
        academicSheetData['schoolDepartment5'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校1_専攻科目ジャンル") {
        academicSheetData['schoolMajor1'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校2_専攻科目ジャンル") {
        academicSheetData['schoolMajor2'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校3_専攻科目ジャンル") {
        academicSheetData['schoolMajor3'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校4_専攻科目ジャンル") {
        academicSheetData['schoolMajor4'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校5_専攻科目ジャンル") {
        academicSheetData['schoolMajor5'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校1_入学年月日") {
        academicSheetData['schoolEnteredDate1'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校2_入学年月日") {
        academicSheetData['schoolEnteredDate2'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校3_入学年月日") {
        academicSheetData['schoolEnteredDate3'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校4_入学年月日") {
        academicSheetData['schoolEnteredDate4'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校5_入学年月日") {
        academicSheetData['schoolEnteredDate5'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校1_卒業・中退") {
        academicSheetData['graduatedAndDropout1'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校2_卒業・中退") {
        academicSheetData['graduatedAndDropout2'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校3_卒業・中退") {
        academicSheetData['graduatedAndDropout3'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校4_卒業・中退") {
        academicSheetData['graduatedAndDropout4'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校5_卒業・中退") {
        academicSheetData['graduatedAndDropout5'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校1_卒業・中退年月日") {
        academicSheetData['graduatedAndDropoutDate1'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校2_卒業・中退年月日") {
        academicSheetData['graduatedAndDropoutDate2'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校3_卒業・中退年月日") {
        academicSheetData['graduatedAndDropoutDate3'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校4_卒業・中退年月日") {
        academicSheetData['graduatedAndDropoutDate4'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
      if (academicSheetList['custom_fields'][academicSheetKey]['name'] == "学校5_卒業・中退年月日") {
        academicSheetData['graduatedAndDropoutDate5'] = academicSheetList['custom_fields'][academicSheetKey]['id'];
      }
    }
    const academicSheetIdList = {
      'sheetId' : academicSheetList['id'],
      'schoolCategory1' : academicSheetData['schoolCategory1'],
      'schoolCategory2' : academicSheetData['schoolCategory2'],
      'schoolCategory3' : academicSheetData['schoolCategory3'],
      'schoolCategory4' : academicSheetData['schoolCategory4'],
      'schoolCategory5' : academicSheetData['schoolCategory5'],
      'schoolName1' : academicSheetData['schoolName1'],
      'schoolName2' : academicSheetData['schoolName2'],
      'schoolName3' : academicSheetData['schoolName3'],
      'schoolName4' : academicSheetData['schoolName4'],
      'schoolName5' : academicSheetData['schoolName5'],
      'schoolDepartment1' : academicSheetData['schoolDepartment1'],
      'schoolDepartment2' : academicSheetData['schoolDepartment2'],
      'schoolDepartment3' : academicSheetData['schoolDepartment3'],
      'schoolDepartment4' : academicSheetData['schoolDepartment4'],
      'schoolDepartment5' : academicSheetData['schoolDepartment5'],
      'schoolMajor1' : academicSheetData['schoolMajor1'],
      'schoolMajor2' : academicSheetData['schoolMajor2'],
      'schoolMajor3' : academicSheetData['schoolMajor3'],
      'schoolMajor4' : academicSheetData['schoolMajor4'],
      'schoolMajor5' : academicSheetData['schoolMajor5'],
      'schoolEnteredDate1' : academicSheetData['schoolEnteredDate1'],
      'schoolEnteredDate2' : academicSheetData['schoolEnteredDate2'],
      'schoolEnteredDate3' : academicSheetData['schoolEnteredDate3'],
      'schoolEnteredDate4' : academicSheetData['schoolEnteredDate4'],
      'schoolEnteredDate5' : academicSheetData['schoolEnteredDate5'],
      'graduatedAndDropout1' : academicSheetData['graduatedAndDropout1'],
      'graduatedAndDropout2' : academicSheetData['graduatedAndDropout2'],
      'graduatedAndDropout3' : academicSheetData['graduatedAndDropout3'],
      'graduatedAndDropout4' : academicSheetData['graduatedAndDropout4'],
      'graduatedAndDropout5' : academicSheetData['graduatedAndDropout5'],
      'graduatedAndDropoutDate1' : academicSheetData['graduatedAndDropoutDate1'],
      'graduatedAndDropoutDate2' : academicSheetData['graduatedAndDropoutDate2'],
      'graduatedAndDropoutDate3' : academicSheetData['graduatedAndDropoutDate3'],
      'graduatedAndDropoutDate4' : academicSheetData['graduatedAndDropoutDate4'],
      'graduatedAndDropoutDate5' : academicSheetData['graduatedAndDropoutDate5'],
    }
    // 語学
    const languageSheetList = checkSheetName(sheets_list, kaonaviLanguageSheetName);
    var languageSheetData = [];
    for (var languageSheetKey = 0; languageSheetKey < languageSheetList['custom_fields'].length; languageSheetKey++) {
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "英語（社内テスト）_テスト名") {
        languageSheetData['inhouseEnglishTestName'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "英語（社内テスト）_スコア") {
        languageSheetData['inhouseEnglishTestScore'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "英語（社内テスト）_受験日") {
        languageSheetData['inhouseEnglishTestDate'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "英語_試験名") {
        languageSheetData['englishTestName'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "英語_スコア") {
        languageSheetData['englishTestScore'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "英語_受験日") {
        languageSheetData['englishTestDate'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "その他外国語1_語学名") {
        languageSheetData['otherLanguageName1'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "その他外国語1_級・スコア") {
        languageSheetData['otherLanguageScore1'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "その他外国語1_取得年月日") {
        languageSheetData['otherLanguageAcquisitionDate1'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "その他外国語2_語学名") {
        languageSheetData['otherLanguageName2'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "その他外国語2_級・スコア") {
        languageSheetData['otherLanguageScore2'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
      if (languageSheetList['custom_fields'][languageSheetKey]['name'] == "その他外国語2_取得年月日") {
        languageSheetData['otherLanguageAcquisitionDate2'] = languageSheetList['custom_fields'][languageSheetKey]['id'];
      }
    }
    const languageSheetIdList = {
      'sheetId' : languageSheetList['id'],
      'englishTestName' : languageSheetData['englishTestName'],
      'englishTestScore' : languageSheetData['englishTestScore'],
      'englishTestDate' : languageSheetData['englishTestDate'],
      'inhouseEnglishTestName' : languageSheetData['inhouseEnglishTestName'],
      'inhouseEnglishTestScore' : languageSheetData['inhouseEnglishTestScore'],
      'inhouseEnglishTestDate' : languageSheetData['inhouseEnglishTestDate'],
      'otherLanguageName1' : languageSheetData['otherLanguageName1'],
      'otherLanguageScore1' : languageSheetData['otherLanguageScore1'],
      'otherLanguageAcquisitionDate1' : languageSheetData['otherLanguageAcquisitionDate1'],
      'otherLanguageName2' : languageSheetData['otherLanguageName2'],
      'otherLanguageScore2' : languageSheetData['otherLanguageScore2'],
      'otherLanguageAcquisitionDate2' : languageSheetData['otherLanguageAcquisitionDate2'],
    }
    // 免許・資格等
    const licenseSheetList = checkSheetName(sheets_list, kaonaviLicenseSheetName);
    var licenseSheetData = [];
    for (var licenseSheetKey = 0; licenseSheetKey < licenseSheetList['custom_fields'].length; licenseSheetKey++) {
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "免許・資格名1") {
        licenseSheetData['licenseName1'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "取得年月日（免許・資格）1") {
        licenseSheetData['licenseAcquisitionDate1'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "免許・資格名2") {
        licenseSheetData['licenseName2'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "取得年月日（免許・資格）2") {
        licenseSheetData['licenseAcquisitionDate2'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "知識・技能1") {
        licenseSheetData['knowledgeName1'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "取得年月日（知識・技能）1") {
        licenseSheetData['knowledgeAcquisitionDate1'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "知識・技能2") {
        licenseSheetData['knowledgeName2'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
      if (licenseSheetList['custom_fields'][licenseSheetKey]['name'] == "取得年月日（知識・技能）2") {
        licenseSheetData['knowledgeAcquisitionDate2'] = licenseSheetList['custom_fields'][licenseSheetKey]['id'];
      }
    }
    const licenseSheetIdList = {
      'sheetId' : licenseSheetList['id'],
      'licenseName1' : licenseSheetData['licenseName1'],
      'licenseAcquisitionDate1' : licenseSheetData['licenseAcquisitionDate1'],
      'licenseName2' : licenseSheetData['licenseName2'],
      'licenseAcquisitionDate2' : licenseSheetData['licenseAcquisitionDate2'],
      'knowledgeName1' : licenseSheetData['knowledgeName1'],
      'knowledgeAcquisitionDate1' : licenseSheetData['knowledgeAcquisitionDate1'],
      'knowledgeName2' : licenseSheetData['knowledgeName2'],
      'knowledgeAcquisitionDate2' : licenseSheetData['knowledgeAcquisitionDate2'],
    }

    // 家族情報
    const familySheetList = checkSheetName(sheets_list, kaonaviFamilySheetName);
    var familySheetData = [];
    for (var familySheetKey = 0; familySheetKey < familySheetList['custom_fields'].length; familySheetKey++) {
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_続柄") {
        familySheetData['familyRelationship1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_続柄") {
        familySheetData['familyRelationship2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_続柄") {
        familySheetData['familyRelationship3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_続柄") {
        familySheetData['familyRelationship4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_続柄") {
        familySheetData['familyRelationship5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_続柄") {
        familySheetData['familyRelationship6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_続柄") {
        familySheetData['familyRelationship7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_続柄") {
        familySheetData['familyRelationship8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_続柄") {
        familySheetData['familyRelationship9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_続柄") {
        familySheetData['familyRelationship10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_姓") {
        familySheetData['familyLastName1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_姓") {
        familySheetData['familyLastName2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_姓") {
        familySheetData['familyLastName3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_姓") {
        familySheetData['familyLastName4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_姓") {
        familySheetData['familyLastName5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_姓") {
        familySheetData['familyLastName6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_姓") {
        familySheetData['familyLastName7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_姓") {
        familySheetData['familyLastName8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_姓") {
        familySheetData['familyLastName9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_姓") {
        familySheetData['familyLastName10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_名") {
        familySheetData['familyFirstName1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_名") {
        familySheetData['familyFirstName2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_名") {
        familySheetData['familyFirstName3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_名") {
        familySheetData['familyFirstName4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_名") {
        familySheetData['familyFirstName5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_名") {
        familySheetData['familyFirstName6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_名") {
        familySheetData['familyFirstName7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_名") {
        familySheetData['familyFirstName8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_名") {
        familySheetData['familyFirstName9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_名") {
        familySheetData['familyFirstName10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_姓（フリガナ）") {
        familySheetData['familyLastNameKana1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_姓（フリガナ）") {
        familySheetData['familyLastNameKana2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_姓（フリガナ）") {
        familySheetData['familyLastNameKana3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_姓（フリガナ）") {
        familySheetData['familyLastNameKana4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_姓（フリガナ）") {
        familySheetData['familyLastNameKana5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_姓（フリガナ）") {
        familySheetData['familyLastNameKana6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_姓（フリガナ）") {
        familySheetData['familyLastNameKana7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_姓（フリガナ）") {
        familySheetData['familyLastNameKana8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_姓（フリガナ）") {
        familySheetData['familyLastNameKana9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_姓（フリガナ）") {
        familySheetData['familyLastNameKana10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_名（フリガナ）") {
        familySheetData['familyFirstNameKana1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_名（フリガナ）") {
        familySheetData['familyFirstNameKana2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_名（フリガナ）") {
        familySheetData['familyFirstNameKana3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_名（フリガナ）") {
        familySheetData['familyFirstNameKana4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_名（フリガナ）") {
        familySheetData['familyFirstNameKana5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_名（フリガナ）") {
        familySheetData['familyFirstNameKana6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_名（フリガナ）") {
        familySheetData['familyFirstNameKana7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_名（フリガナ）") {
        familySheetData['familyFirstNameKana8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_名（フリガナ）") {
        familySheetData['familyFirstNameKana9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_名（フリガナ）") {
        familySheetData['familyFirstNameKana10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_性別") {
        familySheetData['familyGender1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_性別") {
        familySheetData['familyGender2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_性別") {
        familySheetData['familyGender3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_性別") {
        familySheetData['familyGender4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_性別") {
        familySheetData['familyGender5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_性別") {
        familySheetData['familyGender6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_性別") {
        familySheetData['familyGender7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_性別") {
        familySheetData['familyGender8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_性別") {
        familySheetData['familyGender9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_性別") {
        familySheetData['familyGender10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_生年月日") {
        familySheetData['familyBirthday1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_生年月日") {
        familySheetData['familyBirthday2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_生年月日") {
        familySheetData['familyBirthday3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_生年月日") {
        familySheetData['familyBirthday4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_生年月日") {
        familySheetData['familyBirthday5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_生年月日") {
        familySheetData['familyBirthday6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_生年月日") {
        familySheetData['familyBirthday7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_生年月日") {
        familySheetData['familyBirthday8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_生年月日") {
        familySheetData['familyBirthday9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_生年月日") {
        familySheetData['familyBirthday10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_電話番号") {
        familySheetData['familyTelNumber1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_電話番号") {
        familySheetData['familyTelNumber2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_電話番号") {
        familySheetData['familyTelNumber3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_電話番号") {
        familySheetData['familyTelNumber4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_電話番号") {
        familySheetData['familyTelNumber5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_電話番号") {
        familySheetData['familyTelNumber6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_電話番号") {
        familySheetData['familyTelNumber7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_電話番号") {
        familySheetData['familyTelNumber8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_電話番号") {
        familySheetData['familyTelNumber9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_電話番号") {
        familySheetData['familyTelNumber10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_職業") {
        familySheetData['familyJob1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_職業") {
        familySheetData['familyJob2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_職業") {
        familySheetData['familyJob3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_職業") {
        familySheetData['familyJob4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_職業") {
        familySheetData['familyJob5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_職業") {
        familySheetData['familyJob6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_職業") {
        familySheetData['familyJob7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_職業") {
        familySheetData['familyJob8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_職業") {
        familySheetData['familyJob9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_職業") {
        familySheetData['familyJob10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_同居・別居の別") {
        familySheetData['familyLiveTogether1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_同居・別居の別") {
        familySheetData['familyLiveTogether2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_同居・別居の別") {
        familySheetData['familyLiveTogether3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_同居・別居の別") {
        familySheetData['familyLiveTogether4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_同居・別居の別") {
        familySheetData['familyLiveTogether5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_同居・別居の別") {
        familySheetData['familyLiveTogether6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_同居・別居の別") {
        familySheetData['familyLiveTogether7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_同居・別居の別") {
        familySheetData['familyLiveTogether8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_同居・別居の別") {
        familySheetData['familyLiveTogether9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_同居・別居の別") {
        familySheetData['familyLiveTogether10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_住所（郵便番号）") {
        familySheetData['familyZipCode1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_住所（郵便番号）") {
        familySheetData['familyZipCode2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_住所（郵便番号）") {
        familySheetData['familyZipCode3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_住所（郵便番号）") {
        familySheetData['familyZipCode4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_住所（郵便番号）") {
        familySheetData['familyZipCode5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_住所（郵便番号）") {
        familySheetData['familyZipCode6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_住所（郵便番号）") {
        familySheetData['familyZipCode7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_住所（郵便番号）") {
        familySheetData['familyZipCode8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_住所（郵便番号）") {
        familySheetData['familyZipCode9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_住所（郵便番号）") {
        familySheetData['familyZipCode10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_住所（都道府県）") {
        familySheetData['familyPref1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_住所（都道府県）") {
        familySheetData['familyPref2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_住所（都道府県）") {
        familySheetData['familyPref3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_住所（都道府県）") {
        familySheetData['familyPref4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_住所（都道府県）") {
        familySheetData['familyPref5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_住所（都道府県）") {
        familySheetData['familyPref6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_住所（都道府県）") {
        familySheetData['familyPref7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_住所（都道府県）") {
        familySheetData['familyPref8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_住所（都道府県）") {
        familySheetData['familyPref9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_住所（都道府県）") {
        familySheetData['familyPref10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_住所（市区町村）") {
        familySheetData['familyCity1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_住所（市区町村）") {
        familySheetData['familyCity2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_住所（市区町村）") {
        familySheetData['familyCity3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_住所（市区町村）") {
        familySheetData['familyCity4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_住所（市区町村）") {
        familySheetData['familyCity5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_住所（市区町村）") {
        familySheetData['familyCity6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_住所（市区町村）") {
        familySheetData['familyCity7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_住所（市区町村）") {
        familySheetData['familyCity8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_住所（市区町村）") {
        familySheetData['familyCity9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_住所（市区町村）") {
        familySheetData['familyCity10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_住所（丁目・番地）") {
        familySheetData['familyStreet1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_住所（丁目・番地）") {
        familySheetData['familyStreet2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_住所（丁目・番地）") {
        familySheetData['familyStreet3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_住所（丁目・番地）") {
        familySheetData['familyStreet4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_住所（丁目・番地）") {
        familySheetData['familyStreet5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_住所（丁目・番地）") {
        familySheetData['familyStreet6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_住所（丁目・番地）") {
        familySheetData['familyStreet7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_住所（丁目・番地）") {
        familySheetData['familyStreet8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_住所（丁目・番地）") {
        familySheetData['familyStreet9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_住所（丁目・番地）") {
        familySheetData['familyStreet10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族1_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding1'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族2_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding2'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族3_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding3'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族4_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding4'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族5_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding5'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族6_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding6'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族7_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding7'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族8_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding8'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族9_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding9'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
      if (familySheetList['custom_fields'][familySheetKey]['name'] == "家族10_住所（建物名・部屋番号）") {
        familySheetData['familyBuilding10'] = familySheetList['custom_fields'][familySheetKey]['id'];
      }
    }
    const familySheetIdList = {
      'sheetId' : familySheetList['id'],
      'familyRelationship1' : familySheetData['familyRelationship1'],
      'familyRelationship2' : familySheetData['familyRelationship2'],
      'familyRelationship3' : familySheetData['familyRelationship3'],
      'familyRelationship4' : familySheetData['familyRelationship4'],
      'familyRelationship5' : familySheetData['familyRelationship5'],
      'familyRelationship6' : familySheetData['familyRelationship6'],
      'familyRelationship7' : familySheetData['familyRelationship7'],
      'familyRelationship8' : familySheetData['familyRelationship8'],
      'familyRelationship9' : familySheetData['familyRelationship9'],
      'familyRelationship10' : familySheetData['familyRelationship10'],
      'familyLastName1' : familySheetData['familyLastName1'],
      'familyLastName2' : familySheetData['familyLastName2'],
      'familyLastName3' : familySheetData['familyLastName3'],
      'familyLastName4' : familySheetData['familyLastName4'],
      'familyLastName5' : familySheetData['familyLastName5'],
      'familyLastName6' : familySheetData['familyLastName6'],
      'familyLastName7' : familySheetData['familyLastName7'],
      'familyLastName8' : familySheetData['familyLastName8'],
      'familyLastName9' : familySheetData['familyLastName9'],
      'familyLastName10' : familySheetData['familyLastName10'],
      'familyFirstName1' : familySheetData['familyFirstName1'],
      'familyFirstName2' : familySheetData['familyFirstName2'],
      'familyFirstName3' : familySheetData['familyFirstName3'],
      'familyFirstName4' : familySheetData['familyFirstName4'],
      'familyFirstName5' : familySheetData['familyFirstName5'],
      'familyFirstName6' : familySheetData['familyFirstName6'],
      'familyFirstName7' : familySheetData['familyFirstName7'],
      'familyFirstName8' : familySheetData['familyFirstName8'],
      'familyFirstName9' : familySheetData['familyFirstName9'],
      'familyFirstName10' : familySheetData['familyFirstName10'],
      'familyLastNameKana1' : familySheetData['familyLastNameKana1'],
      'familyLastNameKana2' : familySheetData['familyLastNameKana2'],
      'familyLastNameKana3' : familySheetData['familyLastNameKana3'],
      'familyLastNameKana4' : familySheetData['familyLastNameKana4'],
      'familyLastNameKana5' : familySheetData['familyLastNameKana5'],
      'familyLastNameKana6' : familySheetData['familyLastNameKana6'],
      'familyLastNameKana7' : familySheetData['familyLastNameKana7'],
      'familyLastNameKana8' : familySheetData['familyLastNameKana8'],
      'familyLastNameKana9' : familySheetData['familyLastNameKana9'],
      'familyLastNameKana10' : familySheetData['familyLastNameKana10'],
      'familyFirstNameKana1' : familySheetData['familyFirstNameKana1'],
      'familyFirstNameKana2' : familySheetData['familyFirstNameKana2'],
      'familyFirstNameKana3' : familySheetData['familyFirstNameKana3'],
      'familyFirstNameKana4' : familySheetData['familyFirstNameKana4'],
      'familyFirstNameKana5' : familySheetData['familyFirstNameKana5'],
      'familyFirstNameKana6' : familySheetData['familyFirstNameKana6'],
      'familyFirstNameKana7' : familySheetData['familyFirstNameKana7'],
      'familyFirstNameKana8' : familySheetData['familyFirstNameKana8'],
      'familyFirstNameKana9' : familySheetData['familyFirstNameKana9'],
      'familyFirstNameKana10' : familySheetData['familyFirstNameKana10'],
      'familyGender1' : familySheetData['familyGender1'],
      'familyGender2' : familySheetData['familyGender2'],
      'familyGender3' : familySheetData['familyGender3'],
      'familyGender4' : familySheetData['familyGender4'],
      'familyGender5' : familySheetData['familyGender5'],
      'familyGender6' : familySheetData['familyGender6'],
      'familyGender7' : familySheetData['familyGender7'],
      'familyGender8' : familySheetData['familyGender8'],
      'familyGender9' : familySheetData['familyGender9'],
      'familyGender10' : familySheetData['familyGender10'],
      'familyBirthday1' : familySheetData['familyBirthday1'],
      'familyBirthday2' : familySheetData['familyBirthday2'],
      'familyBirthday3' : familySheetData['familyBirthday3'],
      'familyBirthday4' : familySheetData['familyBirthday4'],
      'familyBirthday5' : familySheetData['familyBirthday5'],
      'familyBirthday6' : familySheetData['familyBirthday6'],
      'familyBirthday7' : familySheetData['familyBirthday7'],
      'familyBirthday8' : familySheetData['familyBirthday8'],
      'familyBirthday9' : familySheetData['familyBirthday9'],
      'familyBirthday10' : familySheetData['familyBirthday10'],
      'familyTelNumber1' : familySheetData['familyTelNumber1'],
      'familyTelNumber2' : familySheetData['familyTelNumber2'],
      'familyTelNumber3' : familySheetData['familyTelNumber3'],
      'familyTelNumber4' : familySheetData['familyTelNumber4'],
      'familyTelNumber5' : familySheetData['familyTelNumber5'],
      'familyTelNumber6' : familySheetData['familyTelNumber6'],
      'familyTelNumber7' : familySheetData['familyTelNumber7'],
      'familyTelNumber8' : familySheetData['familyTelNumber8'],
      'familyTelNumber9' : familySheetData['familyTelNumber9'],
      'familyTelNumber10' : familySheetData['familyTelNumber10'],
      'familyJob1' : familySheetData['familyJob1'],
      'familyJob2' : familySheetData['familyJob2'],
      'familyJob3' : familySheetData['familyJob3'],
      'familyJob4' : familySheetData['familyJob4'],
      'familyJob5' : familySheetData['familyJob5'],
      'familyJob6' : familySheetData['familyJob6'],
      'familyJob7' : familySheetData['familyJob7'],
      'familyJob8' : familySheetData['familyJob8'],
      'familyJob9' : familySheetData['familyJob9'],
      'familyJob10' : familySheetData['familyJob10'],
      'familyLiveTogether1' : familySheetData['familyLiveTogether1'],
      'familyLiveTogether2' : familySheetData['familyLiveTogether2'],
      'familyLiveTogether3' : familySheetData['familyLiveTogether3'],
      'familyLiveTogether4' : familySheetData['familyLiveTogether4'],
      'familyLiveTogether5' : familySheetData['familyLiveTogether5'],
      'familyLiveTogether6' : familySheetData['familyLiveTogether6'],
      'familyLiveTogether7' : familySheetData['familyLiveTogether7'],
      'familyLiveTogether8' : familySheetData['familyLiveTogether8'],
      'familyLiveTogether9' : familySheetData['familyLiveTogether9'],
      'familyLiveTogether10' : familySheetData['familyLiveTogether10'],
      'familyZipCode1' : familySheetData['familyZipCode1'],
      'familyZipCode2' : familySheetData['familyZipCode2'],
      'familyZipCode3' : familySheetData['familyZipCode3'],
      'familyZipCode4' : familySheetData['familyZipCode4'],
      'familyZipCode5' : familySheetData['familyZipCode5'],
      'familyZipCode6' : familySheetData['familyZipCode6'],
      'familyZipCode7' : familySheetData['familyZipCode7'],
      'familyZipCode8' : familySheetData['familyZipCode8'],
      'familyZipCode9' : familySheetData['familyZipCode9'],
      'familyZipCode10' : familySheetData['familyZipCode10'],
      'familyPref1' : familySheetData['familyPref1'],
      'familyPref2' : familySheetData['familyPref2'],
      'familyPref3' : familySheetData['familyPref3'],
      'familyPref4' : familySheetData['familyPref4'],
      'familyPref5' : familySheetData['familyPref5'],
      'familyPref6' : familySheetData['familyPref6'],
      'familyPref7' : familySheetData['familyPref7'],
      'familyPref8' : familySheetData['familyPref8'],
      'familyPref9' : familySheetData['familyPref9'],
      'familyPref10' : familySheetData['familyPref10'],
      'familyCity1' : familySheetData['familyCity1'],
      'familyCity2' : familySheetData['familyCity2'],
      'familyCity3' : familySheetData['familyCity3'],
      'familyCity4' : familySheetData['familyCity4'],
      'familyCity5' : familySheetData['familyCity5'],
      'familyCity6' : familySheetData['familyCity6'],
      'familyCity7' : familySheetData['familyCity7'],
      'familyCity8' : familySheetData['familyCity8'],
      'familyCity9' : familySheetData['familyCity9'],
      'familyCity10' : familySheetData['familyCity10'],
      'familyStreet1' : familySheetData['familyStreet1'],
      'familyStreet2' : familySheetData['familyStreet2'],
      'familyStreet3' : familySheetData['familyStreet3'],
      'familyStreet4' : familySheetData['familyStreet4'],
      'familyStreet5' : familySheetData['familyStreet5'],
      'familyStreet6' : familySheetData['familyStreet6'],
      'familyStreet7' : familySheetData['familyStreet7'],
      'familyStreet8' : familySheetData['familyStreet8'],
      'familyStreet9' : familySheetData['familyStreet9'],
      'familyStreet10' : familySheetData['familyStreet10'],
      'familyBuilding1' : familySheetData['familyBuilding1'],
      'familyBuilding2' : familySheetData['familyBuilding2'],
      'familyBuilding3' : familySheetData['familyBuilding3'],
      'familyBuilding4' : familySheetData['familyBuilding4'],
      'familyBuilding5' : familySheetData['familyBuilding5'],
      'familyBuilding6' : familySheetData['familyBuilding6'],
      'familyBuilding7' : familySheetData['familyBuilding7'],
      'familyBuilding8' : familySheetData['familyBuilding8'],
      'familyBuilding9' : familySheetData['familyBuilding9'],
      'familyBuilding10' : familySheetData['familyBuilding10'],
    }

    const employeeIdList = createKaonaviIdList();
    // 文字列(エラー)が返却された場合、エラーハンドリング
    if (typeof employeeIdList == "string") {
      SpreadsheetApp.getUi().alert(employeeIdList);
      throw new Error("スプレッドシート操作エラー：" + employeeIdList);
    }

    // smartHR_社員情報を取得
    const employeesData = createKaonaviEmployeeList(employeeIdList);

    // カオナビAPIリクエスト送信形式_データ格納用配列変数
    let basicInfoList = [];  // 基本情報
    let contactList = [];  // 連絡先
    let addressList = [];  // 住所
    let emergencyContactList = [];  // 緊急連絡先
    let bankList = [];  // 銀行口座
    let academicList = [];  // 学歴
    let languageList = [];  // 語学
    let licenseList = [];  // 免許・資格等
    let familyList = [];  // 家族情報

    // 登録対象の社員人数分ループ参照
    for (var l = 0; l < employeesData.length; l++) {
      // 対象社員の家族情報を取得
      const employeeFamilyData = callShrFamilyApi(employeesData[l]['id']);

      // SmartHR_各種カスタム項目_整形用配列
      // 採用経緯
      var recruitmentData = [];
      // 学歴
      var academicHistoryData = [];
      // 英語
      var englishData = [];
      // 英語(社内テスト)
      var inhouseEnglishData = [];
      // その他外国語
      var otherLanguageData = [];
      // 語学
      var languageData = [];
      // 免許・資格等
      var licenseData = [];
      // 知識・技能
      var knowledgeData = [];
      // 家族情報
      var familyData = [];

      if (employeesData[l]['custom_fields'].length > 0) {
        for (var cl = 0; cl < employeesData[l]['custom_fields'].length; cl++) {
          // 採用経緯
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("recruitmentGroupId")) {
            recruitmentData.push(employeesData[l]['custom_fields'][cl]);
          }
          // 学歴
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("academicHistoryGroupId")) {
            academicHistoryData.push(employeesData[l]['custom_fields'][cl]);
          }
          // 英語
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("englishGroupId")) {
            englishData.push(employeesData[l]['custom_fields'][cl]);
          }
          // 英語(社内テスト)
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("inhouseEnglishGroupId")) {
            inhouseEnglishData.push(employeesData[l]['custom_fields'][cl]);
          }
          // その他外国語
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("otherLanguageGroupId")) {
            otherLanguageData.push(employeesData[l]['custom_fields'][cl]);
          }
          // 免許・資格
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("licenseGroupId")) {
            licenseData.push(employeesData[l]['custom_fields'][cl]);
          }
          // 知識・技能
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("knowledgeGroupId")) {
            knowledgeData.push(employeesData[l]['custom_fields'][cl]);
          }
        }
      }

      /* 各種変数 */
      // 基本情報
      var employeeNumber = employeesData[l]['emp_code'];
      var employeeName = employeesData[l]['business_last_name'] + "　" + employeesData[l]['business_first_name'];
      var employeeNameKana = employeesData[l]['business_last_name_yomi'] + "　" + employeesData[l]['business_first_name_yomi'];
      var enteredDate = employeesData[l]['entered_at']
      var gender = employeesData[l]['gender'] === "male"　? "男性" : employeesData[l]['gender'] === "female" ? "女性" : "";
      var birthday = employeesData[l]['birth_at'];
      // 抽出した採用経緯データを変数へ代入
      if (recruitmentData.length > 0) {
        for (var rl = 0; rl < recruitmentData.length; rl++) {
          // 採用形態
          if (recruitmentData[rl]['template']['name'] == "採用形態") {
            for (var relm = 0; relm < recruitmentData[rl]['template']['elements'].length; relm++) {
              if (recruitmentData[rl]['value'] == recruitmentData[rl]['template']['elements'][relm]['id']) {
                recruitmentForm = recruitmentData[rl]['template']['elements'][relm]['name'];
              }
            }
          }
        }
      }

      // 連絡先
      var email = employeesData[l]['email'];
      var telNumber = employeesData[l]['tel_number'];

      // 現住所
      var zipCode = employeesData[l]['address']['zip_code'] ? employeesData[l]['address']['zip_code'] : null;
      var pref = employeesData[l]['address']['pref'] ? employeesData[l]['address']['pref'] : null;
      var city = employeesData[l]['address']['city'] ? employeesData[l]['address']['city'] : null;
      var street = employeesData[l]['address']['street'] ? employeesData[l]['address']['street'] : null;
      var building = employeesData[l]['address']['building'] ? employeesData[l]['address']['building'] : null;
      var countryNumber = employeesData[l]['address']['country_number'] ? employeesData[l]['address']['country_number'] : null;

      // 緊急連絡先
      var emergencyRelationName = employeesData[l]['emergency_relation_name'];
      var emergencyName = employeesData[l]['emergency_last_name'] + "　" +  employeesData[l]['emergency_first_name'];
      var emergencyNameKana = employeesData[l]['emergency_last_name_yomi'] + "　" +  employeesData[l]['emergency_first_name_yomi'];
      var emergencyTelNumber = employeesData[l]['emergency_tel_number'];
      var emergencyAddressZipcode = employeesData[l]['emergency_address']['zip_code'] ? employeesData[l]['emergency_address']['zip_code'] : null;
      var emergencyAddressPref = employeesData[l]['emergency_address']['pref'] ? employeesData[l]['emergency_address']['pref'] : null;
      var emergencyAddressCity = employeesData[l]['emergency_address']['city'] ? employeesData[l]['emergency_address']['city'] : null;
      var emergencyAddressStreet = employeesData[l]['emergency_address']['street'] ? employeesData[l]['emergency_address']['street'] : null;
      var emergencyAddressBuilding = employeesData[l]['emergency_address']['building'] ? employeesData[l]['emergency_address']['building'] : null;

      // 銀行口座
      var bankCode = employeesData[l]['bank_accounts'] ? employeesData[l]['bank_accounts'][0]['bank_code'] : null;
      var bankBranchCode = employeesData[l]['bank_accounts'] ? employeesData[l]['bank_accounts'][0]['bank_branch_code'] : null;
      var accountType = employeesData[l]['bank_accounts'] ? employeesData[l]['bank_accounts'][0]['account_type'] : null;
      if (accountType != null) {
        if (accountType == "saving") {
          accountType = "普通";
        } else if (accountType == "checking") {
          accountType = "当座";
        } else if (accountType == "deposit") {
          accountType = "貯蓄";
        }
      }
      var accountNumber = employeesData[l]['bank_accounts'] ? employeesData[l]['bank_accounts'][0]['account_number'] : null;
      var accountHolderName = employeesData[l]['bank_accounts'] ? employeesData[l]['bank_accounts'][0]['account_holder_name'] : null;

      // 学歴
      var schoolCategory1 = null;
      var schoolCategory2 = null;
      var schoolCategory3 = null;
      var schoolCategory4 = null;
      var schoolCategory5 = null;
      var schoolName1 = null;
      var schoolName2 = null;
      var schoolName3 = null;
      var schoolName4 = null;
      var schoolName5 = null;
      var schoolDepartment1 = null;
      var schoolDepartment2 = null;
      var schoolDepartment3 = null;
      var schoolDepartment4 = null;
      var schoolDepartment5 = null;
      var schoolMajor1 = null;
      var schoolMajor2 = null;
      var schoolMajor3 = null;
      var schoolMajor4 = null;
      var schoolMajor5 = null;
      var schoolEnteredDate1 = null;
      var schoolEnteredDate2 = null;
      var schoolEnteredDate3 = null;
      var schoolEnteredDate4 = null;
      var schoolEnteredDate5 = null;
      var graduatedAndDropout1 = null;
      var graduatedAndDropout2 = null;
      var graduatedAndDropout3 = null;
      var graduatedAndDropout4 = null;
      var graduatedAndDropout5 = null;
      var graduatedAndDropoutDate1 = null;
      var graduatedAndDropoutDate2 = null;
      var graduatedAndDropoutDate3 = null;
      var graduatedAndDropoutDate4 = null;
      var graduatedAndDropoutDate5 = null;

      // 抽出した学歴データを変数へ代入
      if (academicHistoryData.length > 0) {
        for (var ahl = 0; ahl < academicHistoryData.length; ahl++) {
          // 学校分類
          if (academicHistoryData[ahl]['template']['name'] == "学校1_学校分類") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolCategory1 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校2_学校分類") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolCategory2 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校3_学校分類") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolCategory3 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校4_学校分類") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolCategory4 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校5_学校分類") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolCategory5 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          // 学校名
          if (academicHistoryData[ahl]['template']['name'] == "学校1_学校名") {
            schoolName1 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校2_学校名") {
            schoolName2 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校3_学校名") {
            schoolName3 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校4_学校名") {
            schoolName4 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校5_学校名") {
            schoolName5 = academicHistoryData[ahl]['value'];
          }
          // 学部・学科
          if (academicHistoryData[ahl]['template']['name'] == "学校1_学部・学科・コース") {
            schoolDepartment1 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校2_学部・学科・コース") {
            schoolDepartment2 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校3_学部・学科・コース") {
            schoolDepartment3 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校4_学部・学科・コース") {
            schoolDepartment4 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校5_学部・学科・コース") {
            schoolDepartment5 = academicHistoryData[ahl]['value'];
          }
          // 専攻科目
          if (academicHistoryData[ahl]['template']['name'] == "学校1_専攻科目ジャンル") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolMajor1 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校2_専攻科目ジャンル") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolMajor2 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校3_専攻科目ジャンル") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolMajor3 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校4_専攻科目ジャンル") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolMajor4 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校5_専攻科目ジャンル") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                schoolMajor5 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          // 入学年月日
          if (academicHistoryData[ahl]['template']['name'] == "学校1_入学年月日") {
            schoolEnteredDate1 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校2_入学年月日") {
            schoolEnteredDate2 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校3_入学年月日") {
            schoolEnteredDate3 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校4_入学年月日") {
            schoolEnteredDate4 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校5_入学年月日") {
            schoolEnteredDate5 = academicHistoryData[ahl]['value'];
          }
          // 卒業・中退
          if (academicHistoryData[ahl]['template']['name'] == "学校1_卒業・中退") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                graduatedAndDropout1 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校2_卒業・中退") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                graduatedAndDropout2 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校3_卒業・中退") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                graduatedAndDropout3 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校4_卒業・中退") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                graduatedAndDropout4 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校5_卒業・中退") {
            for (var ahelm = 0; ahelm < academicHistoryData[ahl]['template']['elements'].length; ahelm++) {
              if (academicHistoryData[ahl]['value'] == academicHistoryData[ahl]['template']['elements'][ahelm]['id']) {
                graduatedAndDropout5 = academicHistoryData[ahl]['template']['elements'][ahelm]['name'];
              }
            }
          }
          // 卒業・中退年月日
          if (academicHistoryData[ahl]['template']['name'] == "学校1_卒業・中退年月日") {
            graduatedAndDropoutDate1 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校2_卒業・中退年月日") {
            graduatedAndDropoutDate2 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校3_卒業・中退年月日") {
            graduatedAndDropoutDate3 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校4_卒業・中退年月日") {
            graduatedAndDropoutDate4 = academicHistoryData[ahl]['value'];
          }
          if (academicHistoryData[ahl]['template']['name'] == "学校5_卒業・中退年月日") {
            graduatedAndDropoutDate5 = academicHistoryData[ahl]['value'];
          }
        }
      }

      // 語学
      var inhouseEnglishTestName = null;
      var inhouseEnglishTestScore = null;
      var inhouseEnglishTestDate = null;
      var englishTestName = null;
      var englishTestScore = null;
      var englishTestDate = null;
      var otherLanguageName1 = null;
      var otherLanguageName2 = null;
      var otherLanguageScore1 = null;
      var otherLanguageScore2 = null;
      var otherLanguageAcquisitionDate1 = null;
      var otherLanguageAcquisitionDate2 = null;

      // 抽出した語学データを変数へ代入
      if (inhouseEnglishData.length > 0) {
        for (var esl = 0; esl < inhouseEnglishData.length; esl++) {
          // 英語（社内テスト）_テスト名
          if (inhouseEnglishData[esl]['template']['name'] == "テスト名") {
            for (var ieelm = 0; ieelm < inhouseEnglishData[esl]['template']['elements'].length; ieelm++) {
              if (inhouseEnglishData[esl]['value'] == inhouseEnglishData[esl]['template']['elements'][ieelm]['id']) {
                inhouseEnglishTestName = inhouseEnglishData[esl]['template']['elements'][ieelm]['name'];
              }
            }
          }
          // 英語（社内テスト）_スコア
          if (inhouseEnglishData[esl]['template']['name'] == "スコア") {
            inhouseEnglishTestScore = inhouseEnglishData[esl]['value'];
          }
          // 英語（社内テスト）_受験日
          if (inhouseEnglishData[esl]['template']['name'] == "受験日") {
            inhouseEnglishTestDate = inhouseEnglishData[esl]['value'];
          }
        }
      }
      if (englishData.length > 0) {
        for (var el = 0; el < englishData.length; el++) {
          // 英語_試験名
          if (englishData[el]['template']['name'] == "英語試験名") {
            for (var eelm = 0; eelm < englishData[el]['template']['elements'].length; eelm++) {
              if (englishData[el]['value'] == englishData[el]['template']['elements'][eelm]['id']) {
                englishTestName = englishData[el]['template']['elements'][eelm]['name'];
              }
            }
          }
          // 英語_スコア
          if (englishData[el]['template']['name'] == "英語スコア") {
            englishTestScore = englishData[el]['value'];
          }
          // 英語_受験日
          if (englishData[el]['template']['name'] == "英語取得年月日") {
            englishTestDate = englishData[el]['value'];
          }
        }
      }
      if (otherLanguageData.length > 0) {
        for (var oll = 0; oll < otherLanguageData.length; oll++) {
          // その他外国語1_語学名
          if (otherLanguageData[oll]['template']['name'] == "その他外国語①") {
            for (var olelm = 0; olelm < otherLanguageData[oll]['template']['elements'].length; olelm++) {
              if (otherLanguageData[oll]['value'] == otherLanguageData[oll]['template']['elements'][olelm]['id']) {
                otherLanguageName1 = otherLanguageData[oll]['template']['elements'][olelm]['name'];
              }
            }
          }
          // その他外国語2_語学名
          if (otherLanguageData[oll]['template']['name'] == "その他外国語②") {
            for (var olelm = 0; olelm < otherLanguageData[oll]['template']['elements'].length; olelm++) {
              if (otherLanguageData[oll]['value'] == otherLanguageData[oll]['template']['elements'][olelm]['id']) {
                otherLanguageName2 = otherLanguageData[oll]['template']['elements'][olelm]['name'];
              }
            }
          }
          // その他外国語1_級・スコア
          if (otherLanguageData[oll]['template']['name'] == "その他外国語検定名、級・スコア等①") {
            otherLanguageScore1 = otherLanguageData[oll]['value'];
          }
          // その他外国語2_級・スコア
          if (otherLanguageData[oll]['template']['name'] == "その他外国語検定名、級・スコア等②") {
            otherLanguageScore2 = otherLanguageData[oll]['value'];
          }
          // その他外国語1_取得年月日
          if (otherLanguageData[oll]['template']['name'] == "その他外国語取得年月日①") {
            otherLanguageAcquisitionDate1 = otherLanguageData[oll]['value'];
          }
          // その他外国語2_取得年月日
          if (otherLanguageData[oll]['template']['name'] == "その他外国語取得年月日②") {
            otherLanguageAcquisitionDate2 = otherLanguageData[oll]['value'];
          }
        }
      }

      // 抽出した免許資格・知識技能データを変数へ代入
      // 免許・資格等
      var licenseName1 = null;
      var licenseName2 = null;
      var licenseAcquisitionDate1 = null;
      var licenseAcquisitionDate2 = null;
      var knowledgeName1 = null;
      var knowledgeName2 = null;
      var knowledgeAcquisitionDate1 = null;
      var knowledgeAcquisitionDate2 = null;

      if (licenseData.length > 0) {
        for (var ll = 0; ll < licenseData.length; ll++) {
          // 免許・資格名
          if (licenseData[ll]['template']['name'] == "免許・資格名①") {
            for (var lelm = 0; lelm < licenseData[ll]['template']['elements'].length; lelm++) {
              if (licenseData[ll]['value'] == licenseData[ll]['template']['elements'][lelm]['id']) {
                licenseName1 = licenseData[ll]['template']['elements'][lelm]['name'];
              }
            }
          }
          if (licenseData[ll]['template']['name'] == "免許・資格名②") {
            for (var lelm = 0; lelm < licenseData[ll]['template']['elements'].length; lelm++) {
              if (licenseData[ll]['value'] == licenseData[ll]['template']['elements'][lelm]['id']) {
                licenseName2 = licenseData[ll]['template']['elements'][lelm]['name'];
              }
            }
          }
          // 取得年月日
          if (licenseData[ll]['template']['name'] == "取得年月日①") {
            licenseAcquisitionDate1 = licenseData[ll]['value'];
          }
          if (licenseData[ll]['template']['name'] == "取得年月日②") {
            licenseAcquisitionDate2 = licenseData[ll]['value'];
          }
        }
      }
      if (knowledgeData.length > 0) {
        for (var kl = 0; kl < knowledgeData.length; kl++) {
          // 知識・技能名
          if (knowledgeData[kl]['template']['name'] == "知識・技能名①") {
            for (var kelm = 0; kelm < knowledgeData[kl]['template']['elements'].length; kelm++) {
              if (knowledgeData[kl]['value'] == knowledgeData[kl]['template']['elements'][kelm]['id']) {
                knowledgeName1 = knowledgeData[kl]['template']['elements'][kelm]['name'];
              }
            }
          }
          if (knowledgeData[kl]['template']['name'] == "知識・技能名②") {
            for (var kelm = 0; kelm < knowledgeData[kl]['template']['elements'].length; kelm++) {
              if (knowledgeData[kl]['value'] == knowledgeData[kl]['template']['elements'][kelm]['id']) {
                knowledgeName2 = knowledgeData[kl]['template']['elements'][kelm]['name'];
              }
            }
          }
          // 取得年月日
          if (knowledgeData[kl]['template']['name'] == "取得年月日①") {
            knowledgeAcquisitionDate1 = knowledgeData[kl]['value'];
          }
          if (knowledgeData[kl]['template']['name'] == "取得年月日②") {
            knowledgeAcquisitionDate2 = knowledgeData[kl]['value'];
          }
        }
      }

      // 抽出した家族データを変数へ代入
      var familyData = {
        1: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        2: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        3: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        4: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        5: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        6: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        7: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        8: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        9: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        },
        10: {
          'familyRelationship' : null,
          'familyLastName' : null,
          'familyFirstName' : null,
          'familyLastNameKana' : null,
          'familyFirstNameKana' : null,
          'familyBirthday' : null,
          'familyGender' : null,
          'familyJob' : null,
          'familyLiveTogether' : null,
          'familyZipCode' : null,
          'familyPref' : null,
          'familyCity' : null,
          'familyStreet' : null,
          'familyBuilding' : null,
          'familyTelNumber' : null,
        }
      }

      for (var efl = 0; efl < employeeFamilyData.length; efl++) {
        // 10人分ループしたらループを抜ける
        if (efl > 9) {
          break;
        }
        familyData[efl+1]['familyRelationship'] = employeeFamilyData[efl]['relation_name'];
        familyData[efl+1]['familyLastName'] = employeeFamilyData[efl]['last_name'];
        familyData[efl+1]['familyFirstName'] = employeeFamilyData[efl]['first_name'];
        familyData[efl+1]['familyLastNameKana'] = employeeFamilyData[efl]['last_name_yomi'];
        familyData[efl+1]['familyFirstNameKana'] = employeeFamilyData[efl]['first_name_yomi'];
        familyData[efl+1]['familyBirthday'] = employeeFamilyData[efl]['birth_at'];
        familyData[efl+1]['familyGender'] = employeeFamilyData[efl]['gender'] === "male" ? "男性" : employeeFamilyData[efl]['gender'] === "female" ? "女性" : null;
        familyData[efl+1]['familyJob'] = employeeFamilyData[efl]['job'];
        familyData[efl+1]['familyLiveTogether'] = employeeFamilyData[efl]['live_together_type'] === "living_together" ? "同居" : employeeFamilyData[efl]['live_together_type'] === "living_separately" ? "別居" : null;
        if (employeeFamilyData[efl]['live_together_type'] === "living_together") {
          familyData[efl+1]['familyZipCode'] = zipCode;
          familyData[efl+1]['familyPref'] = pref;
          familyData[efl+1]['familyCity'] = city;
          familyData[efl+1]['familyStreet'] = street;
          familyData[efl+1]['familyBuilding'] = building;
        } else {
          familyData[efl+1]['familyZipCode'] = employeeFamilyData[efl]['address'] ? employeeFamilyData[efl]['address']['zip_code'] : null;
          familyData[efl+1]['familyPref'] = employeeFamilyData[efl]['address'] ? employeeFamilyData[efl]['address']['pref'] : null;
          familyData[efl+1]['familyCity'] = employeeFamilyData[efl]['address'] ? employeeFamilyData[efl]['address']['city'] : null;
          familyData[efl+1]['familyStreet'] = employeeFamilyData[efl]['address'] ? employeeFamilyData[efl]['address']['street'] : null;
          familyData[efl+1]['familyBuilding'] = employeeFamilyData[efl]['address'] ? employeeFamilyData[efl]['address']['building'] : null;
        }
        familyData[efl+1]['familyTelNumber'] = employeeFamilyData[efl]['tel_number'];
      }

      /* 基本情報 */
      let basicInfo = {
        "code" : employeeNumber,  // 社員番号
        "name" : employeeName,  // 氏名
        "name_kana" : employeeNameKana,  // フリガナ
        "entered_date" : enteredDate,  // 入社日
        "gender" : gender,  // 性別
        "birthday" : birthday,  // 生年月日
      }
      if (recruitmentData.length > 0) {
        basicInfo['custom_fields'] = [
            {
              "id": basicInfoSheetIdList['recruitment'],
              "name": "採用形態",
              "values": [ recruitmentForm ]
            }
        ]
      }

      /* 連絡先 */
      let contact = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // メールアドレス
              {
                "id" : contactSheetIdList['email'],
                "values": [ email ]
              },
              // 電話番号
              {
                "id" : contactSheetIdList['telNumber'],
                "values": [ telNumber ]
              }
            ]
          }
        ]
      }

      /* 現住所シート */
      let address = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // 現住所（郵便番号）
              {
                "id" : addressSheetIdList['zipCode'],
                "values": [ zipCode ]
              },
              // 現住所（都道府県）
              {
                "id" : addressSheetIdList['pref'],
                "values": [ pref ]
              },
              // 現住所（市区町村）
              {
                "id" : addressSheetIdList['city'],
                "values": [ city ]
              },
              // 現住所（丁目・番地）
              {
                "id" : addressSheetIdList['street'],
                "values": [ street ]
              },
              // 現住所（建物名・部屋番号）
              {
                "id" : addressSheetIdList['building'],
                "values": [ building ]
              },
              // 現住所（国コード）
              {
                "id" : addressSheetIdList['countryNumber'],
                "values": [ countryNumber ]
              }
            ]
          }
        ] 
      }

      /* 緊急連絡先 */
      let emergencyContact = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // 緊急連絡先の続柄
              {
                "id" : emergencyContactSheetIdList['relationName'],
                "values": [ emergencyRelationName ]
              },
              // 緊急連絡先の氏名
              {
                "id" : emergencyContactSheetIdList['name'],
                "values": [ emergencyName ]
              },
              // 緊急連絡先のフリガナ
              {
                "id" : emergencyContactSheetIdList['nameKana'],
                "values": [ emergencyNameKana ]
              },
              // 緊急連絡先の電話番号
              {
                "id" : emergencyContactSheetIdList['telNumber'],
                "values": [ emergencyTelNumber ]
              },
              // 緊急連絡先の郵便番号
              {
                "id" : emergencyContactSheetIdList['zipCode'],
                "values": [ emergencyAddressZipcode ]
              },
              // 緊急連絡先の都道府県
              {
                "id" : emergencyContactSheetIdList['pref'],
                "values": [ emergencyAddressPref ]
              },
              // 緊急連絡先の市区町村
              {
                "id" : emergencyContactSheetIdList['city'],
                "values": [ emergencyAddressCity ]
              },
              // 緊急連絡先の丁目・番地
              {
                "id" : emergencyContactSheetIdList['street'],
                "values": [ emergencyAddressStreet ]
              },
              // 緊急連絡先の建物名・部屋番号
              {
                "id" : emergencyContactSheetIdList['building'],
                "values": [ emergencyAddressBuilding ]
              }
            ]
          }
        ]
      }

      /* 銀行口座 */
      let bank = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // 銀行コード
              {
                "id" : bankSheetIdList['bankCode'],
                "values": [ bankCode ]
              },
              // 支店コード
              {
                "id" : bankSheetIdList['bankBranchCode'],
                "values": [ bankBranchCode ]
              },
              // 預金種別
              {
                "id" : bankSheetIdList['accountType'],
                "values": [ accountType ]
              },
              // 口座番号
              {
                "id" : bankSheetIdList['accountNumber'],
                "values": [ accountNumber ]
              },
              // 名義（カタカナ）
              {
                "id" : bankSheetIdList['accountHolderName'],
                "values": [ accountHolderName ]
              }
            ]
          }
        ]
      }

      /* 学歴 */
      let academic = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // 学校1_学校分類
              {
                "id" : academicSheetIdList['schoolCategory1'],
                "values": [ schoolCategory1 ]
              },
              // 学校2_学校分類
              {
                "id" : academicSheetIdList['schoolCategory2'],
                "values": [ schoolCategory2 ]
              },
              // 学校3_学校分類
              {
                "id" : academicSheetIdList['schoolCategory3'],
                "values": [ schoolCategory3 ]
              },
              // 学校4_学校分類
              {
                "id" : academicSheetIdList['schoolCategory4'],
                "values": [ schoolCategory4 ]
              },
              // 学校5_学校分類
              {
                "id" : academicSheetIdList['schoolCategory5'],
                "values": [ schoolCategory5 ]
              },
              // 学校1_学校名
              {
                "id" : academicSheetIdList['schoolName1'],
                "values": [ schoolName1 ]
              },
              // 学校2_学校名
              {
                "id" : academicSheetIdList['schoolName2'],
                "values": [ schoolName2 ]
              },
              // 学校3_学校名
              {
                "id" : academicSheetIdList['schoolName3'],
                "values": [ schoolName3 ]
              },
              // 学校4_学校名
              {
                "id" : academicSheetIdList['schoolName4'],
                "values": [ schoolName4 ]
              },
              // 学校5_学校名
              {
                "id" : academicSheetIdList['schoolName5'],
                "values": [ schoolName5 ]
              },
              // 学校1_学部・学科・コース
              {
                "id" : academicSheetIdList['schoolDepartment1'],
                "values": [ schoolDepartment1 ]
              },
              // 学校2_学部・学科・コース
              {
                "id" : academicSheetIdList['schoolDepartment2'],
                "values": [ schoolDepartment2 ]
              },
              // 学校3_学部・学科・コース
              {
                "id" : academicSheetIdList['schoolDepartment3'],
                "values": [ schoolDepartment3 ]
              },
              // 学校4_学部・学科・コース
              {
                "id" : academicSheetIdList['schoolDepartment4'],
                "values": [ schoolDepartment4 ]
              },
              // 学校5_学部・学科・コース
              {
                "id" : academicSheetIdList['schoolDepartment5'],
                "values": [ schoolDepartment5 ]
              },
              // 学校1_専攻科目ジャンル
              {
                "id" : academicSheetIdList['schoolMajor1'],
                "values": [ schoolMajor1 ]
              },
              // 学校2_専攻科目ジャンル
              {
                "id" : academicSheetIdList['schoolMajor2'],
                "values": [ schoolMajor2 ]
              },
              // 学校3_専攻科目ジャンル
              {
                "id" : academicSheetIdList['schoolMajor3'],
                "values": [ schoolMajor3 ]
              },
              // 学校4_専攻科目ジャンル
              {
                "id" : academicSheetIdList['schoolMajor4'],
                "values": [ schoolMajor4 ]
              },
              // 学校5_専攻科目ジャンル
              {
                "id" : academicSheetIdList['schoolMajor5'],
                "values": [ schoolMajor5 ]
              },
              // 学校1_入学年月日
              {
                "id" : academicSheetIdList['schoolEnteredDate1'],
                "values": [ schoolEnteredDate1 ]
              },
              // 学校2_入学年月日
              {
                "id" : academicSheetIdList['schoolEnteredDate2'],
                "values": [ schoolEnteredDate2 ]
              },
              // 学校3_入学年月日
              {
                "id" : academicSheetIdList['schoolEnteredDate3'],
                "values": [ schoolEnteredDate3 ]
              },
              // 学校4_入学年月日
              {
                "id" : academicSheetIdList['schoolEnteredDate4'],
                "values": [ schoolEnteredDate4 ]
              },
              // 学校5_入学年月日
              {
                "id" : academicSheetIdList['schoolEnteredDate5'],
                "values": [ schoolEnteredDate5 ]
              },
              // 学校1_卒業・中退
              {
                "id" : academicSheetIdList['graduatedAndDropout1'],
                "values": [ graduatedAndDropout1 ]
              },
              // 学校2_卒業・中退
              {
                "id" : academicSheetIdList['graduatedAndDropout2'],
                "values": [ graduatedAndDropout2 ]
              },
              // 学校3_卒業・中退
              {
                "id" : academicSheetIdList['graduatedAndDropout3'],
                "values": [ graduatedAndDropout3 ]
              },
              // 学校4_卒業・中退
              {
                "id" : academicSheetIdList['graduatedAndDropout4'],
                "values": [ graduatedAndDropout4 ]
              },
              // 学校5_卒業・中退
              {
                "id" : academicSheetIdList['graduatedAndDropout5'],
                "values": [ graduatedAndDropout5 ]
              },
              // 学校1_卒業・中退年月日
              {
                "id" : academicSheetIdList['graduatedAndDropoutDate1'],
                "values": [ graduatedAndDropoutDate1 ]
              },
              // 学校2_卒業・中退年月日
              {
                "id" : academicSheetIdList['graduatedAndDropoutDate2'],
                "values": [ graduatedAndDropoutDate2 ]
              },
              // 学校3_卒業・中退年月日
              {
                "id" : academicSheetIdList['graduatedAndDropoutDate3'],
                "values": [ graduatedAndDropoutDate3 ]
              },
              // 学校4_卒業・中退年月日
              {
                "id" : academicSheetIdList['graduatedAndDropoutDate4'],
                "values": [ graduatedAndDropoutDate4 ]
              },
              // 学校5_卒業・中退年月日
              {
                "id" : academicSheetIdList['graduatedAndDropoutDate5'],
                "values": [ graduatedAndDropoutDate5 ]
              },
            ]
          }
        ]
      }

      /* 語学 */
      let language = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // 英語（社内テスト）_テスト名
              {
                "id" : languageSheetIdList['inhouseEnglishTestName'],
                "values": [ inhouseEnglishTestName ]
              },
              // 英語（社内テスト）_スコア
              {
                "id" : languageSheetIdList['inhouseEnglishTestScore'],
                "values": [ inhouseEnglishTestScore ]
              },
              // 英語（社内テスト）_受験日
              {
                "id" : languageSheetIdList['inhouseEnglishTestDate'],
                "values": [ inhouseEnglishTestDate ]
              },
              // 英語_試験名
              {
                "id" : languageSheetIdList['englishTestName'],
                "values": [ englishTestName ]
              },
              // 英語_スコア
              {
                "id" : languageSheetIdList['englishTestScore'],
                "values": [ englishTestScore ]
              },
              // 英語_受験日
              {
                "id" : languageSheetIdList['englishTestDate'],
                "values": [ englishTestDate ]
              },
              // その他外国語1_語学名
              {
                "id" : languageSheetIdList['otherLanguageName1'],
                "values": [ otherLanguageName1 ]
              },
              // その他外国語1_級・スコア
              {
                "id" : languageSheetIdList['otherLanguageScore1'],
                "values": [ otherLanguageScore1 ]
              },
              // その他外国語1_取得年月日
              {
                "id" : languageSheetIdList['otherLanguageAcquisitionDate1'],
                "values": [ otherLanguageAcquisitionDate1 ]
              },
              // その他外国語2_語学名
              {
                "id" : languageSheetIdList['otherLanguageName2'],
                "values": [ otherLanguageName2 ]
              },
              // その他外国語2_級・スコア
              {
                "id" : languageSheetIdList['otherLanguageScore2'],
                "values": [ otherLanguageScore2 ]
              },
              // その他外国語2_取得年月日
              {
                "id" : languageSheetIdList['otherLanguageAcquisitionDate2'],
                "values": [ otherLanguageAcquisitionDate2 ]
              },
            ]
          }
        ]
      }

      /* 免許・資格等 */
      let license = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // 免許・資格名1
              {
                "id" : licenseSheetIdList['licenseName1'],
                "values": [ licenseName1 ]
              },
              // 取得年月日（免許・資格）1
              {
                "id" : licenseSheetIdList['licenseAcquisitionDate1'],
                "values": [ licenseAcquisitionDate1 ]
              },
              // 免許・資格名2
              {
                "id" : licenseSheetIdList['licenseName2'],
                "values": [ licenseName2 ]
              },
              // 取得年月日（免許・資格）2
              {
                "id" : licenseSheetIdList['licenseAcquisitionDate2'],
                "values": [ licenseAcquisitionDate2 ]
              },
              // 知識・技能1
              {
                "id" : licenseSheetIdList['knowledgeName1'],
                "values": [ knowledgeName1 ]
              },
              // 取得年月日（知識・技能）1
              {
                "id" : licenseSheetIdList['knowledgeAcquisitionDate1'],
                "values": [ knowledgeAcquisitionDate1 ]
              },
              // 知識・技能2
              {
                "id" : licenseSheetIdList['knowledgeName2'],
                "values": [ knowledgeName2 ]
              },
              // 取得年月日（知識・技能）2
              {
                "id" : licenseSheetIdList['knowledgeAcquisitionDate2'],
                "values": [ knowledgeAcquisitionDate2 ]
              },
            ]
          }
        ]
      }

      /* 家族情報 */
      let family = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // 家族1_続柄
              {
                "id" : familySheetIdList['familyRelationship1'],
                "values": [ familyData[1]['familyRelationship'] ]
              },
              // 家族2_続柄
              {
                "id" : familySheetIdList['familyRelationship2'],
                "values": [ familyData[2]['familyRelationship'] ]
              },
              // 家族3_続柄
              {
                "id" : familySheetIdList['familyRelationship3'],
                "values": [ familyData[3]['familyRelationship'] ]
              },
              // 家族4_続柄
              {
                "id" : familySheetIdList['familyRelationship4'],
                "values": [ familyData[4]['familyRelationship'] ]
              },
              // 家族5_続柄
              {
                "id" : familySheetIdList['familyRelationship5'],
                "values": [ familyData[5]['familyRelationship'] ]
              },
              // 家族6_続柄
              {
                "id" : familySheetIdList['familyRelationship6'],
                "values": [ familyData[6]['familyRelationship'] ]
              },
              // 家族7_続柄
              {
                "id" : familySheetIdList['familyRelationship7'],
                "values": [ familyData[7]['familyRelationship'] ]
              },
              // 家族8_続柄
              {
                "id" : familySheetIdList['familyRelationship8'],
                "values": [ familyData[8]['familyRelationship'] ]
              },
              // 家族9_続柄
              {
                "id" : familySheetIdList['familyRelationship9'],
                "values": [ familyData[9]['familyRelationship'] ]
              },
              // 家族10_続柄
              {
                "id" : familySheetIdList['familyRelationship10'],
                "values": [ familyData[10]['familyRelationship'] ]
              },
              // 家族1_姓
              {
                "id" : familySheetIdList['familyLastName1'],
                "values": [ familyData[1]['familyLastName'] ]
              },
              // 家族2_姓
              {
                "id" : familySheetIdList['familyLastName2'],
                "values": [ familyData[2]['familyLastName'] ]
              },
              // 家族3_姓
              {
                "id" : familySheetIdList['familyLastName3'],
                "values": [ familyData[3]['familyLastName'] ]
              },
              // 家族4_姓
              {
                "id" : familySheetIdList['familyLastName4'],
                "values": [ familyData[4]['familyLastName'] ]
              },
              // 家族5_姓
              {
                "id" : familySheetIdList['familyLastName5'],
                "values": [ familyData[5]['familyLastName'] ]
              },
              // 家族6_姓
              {
                "id" : familySheetIdList['familyLastName6'],
                "values": [ familyData[6]['familyLastName'] ]
              },
              // 家族7_姓
              {
                "id" : familySheetIdList['familyLastName7'],
                "values": [ familyData[7]['familyLastName'] ]
              },
              // 家族8_姓
              {
                "id" : familySheetIdList['familyLastName8'],
                "values": [ familyData[8]['familyLastName'] ]
              },
              // 家族9_姓
              {
                "id" : familySheetIdList['familyLastName9'],
                "values": [ familyData[9]['familyLastName'] ]
              },
              // 家族10_姓
              {
                "id" : familySheetIdList['familyLastName10'],
                "values": [ familyData[10]['familyLastName'] ]
              },
              // 家族1_名
              {
                "id" : familySheetIdList['familyFirstName1'],
                "values": [ familyData[1]['familyFirstName'] ]
              },
              // 家族2_名
              {
                "id" : familySheetIdList['familyFirstName2'],
                "values": [ familyData[2]['familyFirstName'] ]
              },
              // 家族3_名
              {
                "id" : familySheetIdList['familyFirstName3'],
                "values": [ familyData[3]['familyFirstName'] ]
              },
              // 家族4_名
              {
                "id" : familySheetIdList['familyFirstName4'],
                "values": [ familyData[4]['familyFirstName'] ]
              },
              // 家族5_名
              {
                "id" : familySheetIdList['familyFirstName5'],
                "values": [ familyData[5]['familyFirstName'] ]
              },
              // 家族6_名
              {
                "id" : familySheetIdList['familyFirstName6'],
                "values": [ familyData[6]['familyFirstName'] ]
              },
              // 家族7_名
              {
                "id" : familySheetIdList['familyFirstName7'],
                "values": [ familyData[7]['familyFirstName'] ]
              },
              // 家族8_名
              {
                "id" : familySheetIdList['familyFirstName8'],
                "values": [ familyData[8]['familyFirstName'] ]
              },
              // 家族9_名
              {
                "id" : familySheetIdList['familyFirstName9'],
                "values": [ familyData[9]['familyFirstName'] ]
              },
              // 家族10_名
              {
                "id" : familySheetIdList['familyFirstName10'],
                "values": [ familyData[10]['familyFirstName'] ]
              },
              // 家族1_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana1'],
                "values": [ familyData[1]['familyLastNameKana'] ]
              },
              // 家族2_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana2'],
                "values": [ familyData[2]['familyLastNameKana'] ]
              },
              // 家族3_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana3'],
                "values": [ familyData[3]['familyLastNameKana'] ]
              },
              // 家族4_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana4'],
                "values": [ familyData[4]['familyLastNameKana'] ]
              },
              // 家族5_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana5'],
                "values": [ familyData[5]['familyLastNameKana'] ]
              },
              // 家族6_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana6'],
                "values": [ familyData[6]['familyLastNameKana'] ]
              },
              // 家族7_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana7'],
                "values": [ familyData[7]['familyLastNameKana'] ]
              },
              // 家族8_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana8'],
                "values": [ familyData[8]['familyLastNameKana'] ]
              },
              // 家族9_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana9'],
                "values": [ familyData[9]['familyLastNameKana'] ]
              },
              // 家族10_姓（フリガナ）
              {
                "id" : familySheetIdList['familyLastNameKana10'],
                "values": [ familyData[10]['familyLastNameKana'] ]
              },
              // 家族1_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana1'],
                "values": [ familyData[1]['familyFirstNameKana'] ]
              },
              // 家族2_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana2'],
                "values": [ familyData[2]['familyFirstNameKana'] ]
              },
              // 家族3_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana3'],
                "values": [ familyData[3]['familyFirstNameKana'] ]
              },
              // 家族4_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana4'],
                "values": [ familyData[4]['familyFirstNameKana'] ]
              },
              // 家族5_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana5'],
                "values": [ familyData[5]['familyFirstNameKana'] ]
              },
              // 家族6_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana6'],
                "values": [ familyData[6]['familyFirstNameKana'] ]
              },
              // 家族7_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana7'],
                "values": [ familyData[7]['familyFirstNameKana'] ]
              },
              // 家族8_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana8'],
                "values": [ familyData[8]['familyFirstNameKana'] ]
              },
              // 家族9_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana9'],
                "values": [ familyData[9]['familyFirstNameKana'] ]
              },
              // 家族10_名（フリガナ）
              {
                "id" : familySheetIdList['familyFirstNameKana10'],
                "values": [ familyData[10]['familyFirstNameKana'] ]
              },
              // 家族1_生年月日
              {
                "id" : familySheetIdList['familyBirthday1'],
                "values": [ familyData[1]['familyBirthday'] ]
              },
              // 家族2_生年月日
              {
                "id" : familySheetIdList['familyBirthday2'],
                "values": [ familyData[2]['familyBirthday'] ]
              },
              // 家族3_生年月日
              {
                "id" : familySheetIdList['familyBirthday3'],
                "values": [ familyData[3]['familyBirthday'] ]
              },
              // 家族4_生年月日
              {
                "id" : familySheetIdList['familyBirthday4'],
                "values": [ familyData[4]['familyBirthday'] ]
              },
              // 家族5_生年月日
              {
                "id" : familySheetIdList['familyBirthday5'],
                "values": [ familyData[5]['familyBirthday'] ]
              },
              // 家族6_生年月日
              {
                "id" : familySheetIdList['familyBirthday6'],
                "values": [ familyData[6]['familyBirthday'] ]
              },
              // 家族7_生年月日
              {
                "id" : familySheetIdList['familyBirthday7'],
                "values": [ familyData[7]['familyBirthday'] ]
              },
              // 家族8_生年月日
              {
                "id" : familySheetIdList['familyBirthday8'],
                "values": [ familyData[8]['familyBirthday'] ]
              },
              // 家族9_生年月日
              {
                "id" : familySheetIdList['familyBirthday9'],
                "values": [ familyData[9]['familyBirthday'] ]
              },
              // 家族10_生年月日
              {
                "id" : familySheetIdList['familyBirthday10'],
                "values": [ familyData[10]['familyBirthday'] ]
              },
              // 家族1_性別
              {
                "id" : familySheetIdList['familyGender1'],
                "values": [ familyData[1]['familyGender'] ]
              },
              // 家族2_性別
              {
                "id" : familySheetIdList['familyGender2'],
                "values": [ familyData[2]['familyGender'] ]
              },
              // 家族3_性別
              {
                "id" : familySheetIdList['familyGender3'],
                "values": [ familyData[3]['familyGender'] ]
              },
              // 家族4_性別
              {
                "id" : familySheetIdList['familyGender4'],
                "values": [ familyData[4]['familyGender'] ]
              },
              // 家族5_性別
              {
                "id" : familySheetIdList['familyGender5'],
                "values": [ familyData[5]['familyGender'] ]
              },
              // 家族6_性別
              {
                "id" : familySheetIdList['familyGender6'],
                "values": [ familyData[6]['familyGender'] ]
              },
              // 家族7_性別
              {
                "id" : familySheetIdList['familyGender7'],
                "values": [ familyData[7]['familyGender'] ]
              },
              // 家族8_性別
              {
                "id" : familySheetIdList['familyGender8'],
                "values": [ familyData[8]['familyGender'] ]
              },
              // 家族9_性別
              {
                "id" : familySheetIdList['familyGender9'],
                "values": [ familyData[9]['familyGender'] ]
              },
              // 家族10_性別
              {
                "id" : familySheetIdList['familyGender10'],
                "values": [ familyData[10]['familyGender'] ]
              },
              // 家族1_職業
              {
                "id" : familySheetIdList['familyJob1'],
                "values": [ familyData[1]['familyJob'] ]
              },
              // 家族2_職業
              {
                "id" : familySheetIdList['familyJob2'],
                "values": [ familyData[2]['familyJob'] ]
              },
              // 家族3_職業
              {
                "id" : familySheetIdList['familyJob3'],
                "values": [ familyData[3]['familyJob'] ]
              },
              // 家族4_職業
              {
                "id" : familySheetIdList['familyJob4'],
                "values": [ familyData[4]['familyJob'] ]
              },
              // 家族5_職業
              {
                "id" : familySheetIdList['familyJob5'],
                "values": [ familyData[5]['familyJob'] ]
              },
              // 家族6_職業
              {
                "id" : familySheetIdList['familyJob6'],
                "values": [ familyData[6]['familyJob'] ]
              },
              // 家族7_職業
              {
                "id" : familySheetIdList['familyJob7'],
                "values": [ familyData[7]['familyJob'] ]
              },
              // 家族8_職業
              {
                "id" : familySheetIdList['familyJob8'],
                "values": [ familyData[8]['familyJob'] ]
              },
              // 家族9_職業
              {
                "id" : familySheetIdList['familyJob9'],
                "values": [ familyData[9]['familyJob'] ]
              },
              // 家族10_職業
              {
                "id" : familySheetIdList['familyJob10'],
                "values": [ familyData[10]['familyJob'] ]
              },
              // 家族1_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether1'],
                "values": [ familyData[1]['familyLiveTogether'] ]
              },
              // 家族2_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether2'],
                "values": [ familyData[2]['familyLiveTogether'] ]
              },
              // 家族3_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether3'],
                "values": [ familyData[3]['familyLiveTogether'] ]
              },
              // 家族4_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether4'],
                "values": [ familyData[4]['familyLiveTogether'] ]
              },
              // 家族5_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether5'],
                "values": [ familyData[5]['familyLiveTogether'] ]
              },
              // 家族6_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether6'],
                "values": [ familyData[6]['familyLiveTogether'] ]
              },
              // 家族7_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether7'],
                "values": [ familyData[7]['familyLiveTogether'] ]
              },
              // 家族8_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether8'],
                "values": [ familyData[8]['familyLiveTogether'] ]
              },
              // 家族9_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether9'],
                "values": [ familyData[9]['familyLiveTogether'] ]
              },
              // 家族10_同居・別居の別
              {
                "id" : familySheetIdList['familyLiveTogether10'],
                "values": [ familyData[10]['familyLiveTogether'] ]
              },
              // 家族1_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode1'],
                "values": [ familyData[1]['familyZipCode'] ]
              },
              // 家族2_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode2'],
                "values": [ familyData[2]['familyZipCode'] ]
              },
              // 家族3_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode3'],
                "values": [ familyData[3]['familyZipCode'] ]
              },
              // 家族4_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode4'],
                "values": [ familyData[4]['familyZipCode'] ]
              },
              // 家族5_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode5'],
                "values": [ familyData[5]['familyZipCode'] ]
              },
              // 家族6_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode6'],
                "values": [ familyData[6]['familyZipCode'] ]
              },
              // 家族7_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode7'],
                "values": [ familyData[7]['familyZipCode'] ]
              },
              // 家族8_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode8'],
                "values": [ familyData[8]['familyZipCode'] ]
              },
              // 家族9_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode9'],
                "values": [ familyData[9]['familyZipCode'] ]
              },
              // 家族10_住所（郵便番号）
              {
                "id" : familySheetIdList['familyZipCode10'],
                "values": [ familyData[10]['familyZipCode'] ]
              },
              // 家族1_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref1'],
                "values": [ familyData[1]['familyPref'] ]
              },
              // 家族2_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref2'],
                "values": [ familyData[2]['familyPref'] ]
              },
              // 家族3_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref3'],
                "values": [ familyData[3]['familyPref'] ]
              },
              // 家族4_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref4'],
                "values": [ familyData[4]['familyPref'] ]
              },
              // 家族5_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref5'],
                "values": [ familyData[5]['familyPref'] ]
              },
              // 家族6_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref6'],
                "values": [ familyData[6]['familyPref'] ]
              },
              // 家族7_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref7'],
                "values": [ familyData[7]['familyPref'] ]
              },
              // 家族8_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref8'],
                "values": [ familyData[8]['familyPref'] ]
              },
              // 家族9_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref9'],
                "values": [ familyData[9]['familyPref'] ]
              },
              // 家族10_住所（都道府県）
              {
                "id" : familySheetIdList['familyPref10'],
                "values": [ familyData[10]['familyPref'] ]
              },
              // 家族1_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity1'],
                "values": [ familyData[1]['familyCity'] ]
              },
              // 家族2_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity2'],
                "values": [ familyData[2]['familyCity'] ]
              },
              // 家族3_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity3'],
                "values": [ familyData[3]['familyCity'] ]
              },
              // 家族4_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity4'],
                "values": [ familyData[4]['familyCity'] ]
              },
              // 家族5_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity5'],
                "values": [ familyData[5]['familyCity'] ]
              },
              // 家族6_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity6'],
                "values": [ familyData[6]['familyCity'] ]
              },
              // 家族7_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity7'],
                "values": [ familyData[7]['familyCity'] ]
              },
              // 家族8_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity8'],
                "values": [ familyData[8]['familyCity'] ]
              },
              // 家族9_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity9'],
                "values": [ familyData[9]['familyCity'] ]
              },
              // 家族10_住所（市区町村）
              {
                "id" : familySheetIdList['familyCity10'],
                "values": [ familyData[10]['familyCity'] ]
              },
              // 家族1_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet1'],
                "values": [ familyData[1]['familyStreet'] ]
              },
              // 家族2_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet2'],
                "values": [ familyData[2]['familyStreet'] ]
              },
              // 家族3_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet3'],
                "values": [ familyData[3]['familyStreet'] ]
              },
              // 家族4_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet4'],
                "values": [ familyData[4]['familyStreet'] ]
              },
              // 家族5_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet5'],
                "values": [ familyData[5]['familyStreet'] ]
              },
              // 家族6_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet6'],
                "values": [ familyData[6]['familyStreet'] ]
              },
              // 家族7_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet7'],
                "values": [ familyData[7]['familyStreet'] ]
              },
              // 家族8_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet8'],
                "values": [ familyData[8]['familyStreet'] ]
              },
              // 家族9_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet9'],
                "values": [ familyData[9]['familyStreet'] ]
              },
              // 家族10_住所（丁目・番地）
              {
                "id" : familySheetIdList['familyStreet10'],
                "values": [ familyData[10]['familyStreet'] ]
              },
              // 家族1_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding1'],
                "values": [ familyData[1]['familyBuilding'] ]
              },
              // 家族2_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding2'],
                "values": [ familyData[2]['familyBuilding'] ]
              },
              // 家族3_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding3'],
                "values": [ familyData[3]['familyBuilding'] ]
              },
              // 家族4_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding4'],
                "values": [ familyData[4]['familyBuilding'] ]
              },
              // 家族5_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding5'],
                "values": [ familyData[5]['familyBuilding'] ]
              },
              // 家族6_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding6'],
                "values": [ familyData[6]['familyBuilding'] ]
              },
              // 家族7_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding7'],
                "values": [ familyData[7]['familyBuilding'] ]
              },
              // 家族8_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding8'],
                "values": [ familyData[8]['familyBuilding'] ]
              },
              // 家族9_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding9'],
                "values": [ familyData[9]['familyBuilding'] ]
              },
              // 家族10_住所（建物名・部屋番号）
              {
                "id" : familySheetIdList['familyBuilding10'],
                "values": [ familyData[10]['familyBuilding'] ]
              },
              // 家族1_電話番号
              {
                "id" : familySheetIdList['familyTelNumber1'],
                "values": [ familyData[1]['familyTelNumber'] ]
              },
              // 家族2_電話番号
              {
                "id" : familySheetIdList['familyTelNumber2'],
                "values": [ familyData[2]['familyTelNumber'] ]
              },
              // 家族3_電話番号
              {
                "id" : familySheetIdList['familyTelNumber3'],
                "values": [ familyData[3]['familyTelNumber'] ]
              },
              // 家族4_電話番号
              {
                "id" : familySheetIdList['familyTelNumber4'],
                "values": [ familyData[4]['familyTelNumber'] ]
              },
              // 家族5_電話番号
              {
                "id" : familySheetIdList['familyTelNumber5'],
                "values": [ familyData[5]['familyTelNumber'] ]
              },
              // 家族6_電話番号
              {
                "id" : familySheetIdList['familyTelNumber6'],
                "values": [ familyData[6]['familyTelNumber'] ]
              },
              // 家族7_電話番号
              {
                "id" : familySheetIdList['familyTelNumber7'],
                "values": [ familyData[7]['familyTelNumber'] ]
              },
              // 家族8_電話番号
              {
                "id" : familySheetIdList['familyTelNumber8'],
                "values": [ familyData[8]['familyTelNumber'] ]
              },
              // 家族9_電話番号
              {
                "id" : familySheetIdList['familyTelNumber9'],
                "values": [ familyData[9]['familyTelNumber'] ]
              },
              // 家族10_電話番号
              {
                "id" : familySheetIdList['familyTelNumber10'],
                "values": [ familyData[10]['familyTelNumber'] ]
              },
            ]
          }
        ]
      }

      basicInfoList.push(basicInfo);
      contactList.push(contact);
      addressList.push(address);
      emergencyContactList.push(emergencyContact);
      bankList.push(bank);  
      academicList.push(academic);
      languageList.push(language);
      licenseList.push(license);
      familyList.push(family);
    }

    const basicInfoResult = requestApi(basicInfoList, "post");

    // 社員情報の登録にタイムラグが存在するため待機時間を調整
    Utilities.sleep(120000);

    const contactResult = requestApi(contactList, "patch", contactSheetIdList['sheetId']);
    const addressResult = requestApi(addressList, "patch", addressSheetIdList['sheetId']);
    const emergencyContactResult = requestApi(emergencyContactList, "patch", emergencyContactSheetIdList['sheetId']);
    const bankResult = requestApi(bankList, "patch", bankSheetIdList['sheetId']);
    const academicResult = requestApi(academicList, "patch", academicSheetIdList['sheetId']);

    // 更新系APIの分間あたりの最大リクエスト件数が5件のため待機時間を調整
    Utilities.sleep(60000);

    const languageResult = requestApi(languageList, "patch", languageSheetIdList['sheetId']);
    const licenseResult = requestApi(licenseList, "patch", licenseSheetIdList['sheetId']);
    const familyResult = requestApi(familyList, "patch", familySheetIdList['sheetId']);

    // 終了ログ
  　log(work, 'e');

    SpreadsheetApp.getUi().alert("カオナビへの社員情報登録が完了しました。");
  } catch(e) {
    log(work + "[エラーログ]", "s");
    log(e.message, "error");
    log(work + "[エラーログ]", "e");
    if (!e.message.includes("スプレッドシート操作エラー")) {
      SpreadsheetApp.getUi().alert("カオナビへの社員情報登録に失敗しました。");
    }
  }
}

/**
 * 社員番号を照合し、連携登録対象の社員ID一覧データ配列を生成する
 * 
 * 
 */
function createKaonaviIdList() {
  // 社員番号入力_スプレッドシートに入力された従業員番号を取得する
  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getActiveSheet();
  let lastRow = sheet.getLastRow();  //最終行を取得
  const inputHeaderLine = 8; //社員番号入力するまでの見出しの行数

  // 履歴データ[登録用]から入力された従業員番号のidを取得する
  let idList = [];  //空のリストを作成
  let logss = SpreadsheetApp.openById(getProperties("storeHistorySpreadsheetsId"));
  let logSheet = logss.getSheets()[0];
  let logSheetLastRow = logSheet.getLastRow();
  const logDate = logSheet.getRange(2,1,logSheetLastRow -1,4).getValues();  //履歴データ新規からデータを取得
  

  // 社員番号が入力されている場合のみ実行
  if(lastRow > inputHeaderLine) {
    // 入力された社員番号を取得
    let employeeNumber = sheet.getRange(9,2,lastRow - inputHeaderLine,1).getValues();

    // 取得した社員番号分繰り返し実行
    for(var i = 0; i < employeeNumber.length; i++) {
      for(var j = 0; j < logDate.length; j++) {
        // 履歴データ新規の中に、入力した社員番号が存在するか
        if(logDate[j].includes(String(employeeNumber[i]))) {
          // 存在した場合、リストにidを追加する
          idList.push(logDate[j][3]);
        }
      }
    }
    // 入力された社員番号数と取得出来た社員番号数が一致しない　もしくは　全て間違って入力している
    if(idList.length !== employeeNumber.length || idList.length === 0) {
      return "履歴データに存在しない社員番号が入力されています。";
    }
    
    // 連携登録対象社員情報を返却
    return idList
  } else {
    return "社員番号が入力されていません。";
  }
}

/**
 * SmartHR_APIより社員IDを用いて社員情報を取得し、社員情報一覧配列データを生成する
 * 
 * 
 */
function createKaonaviEmployeeList(idList) {
    // SmartHR_API 環境値
    const AccessToken = getProperties("ACCESS_TOKEN")  //smartHRのアクセストークン
    const SubDomain = getProperties("SUB_DOMAIN")  //smartHRのサブドメイン

  //HTTPリクエストヘッダーの作成
  const headers = {
    //アクセストークンの設定
    'Authorization': 'Bearer ' + AccessToken
  }

  //HTTPリクエストのオプションの設定
  const params = {
    'method': 'GET',  //GETメソッドでリクエスト
    'headers' : headers  //HTTPリクエストヘッダー
  }

  let responseList = [];

  for(var k = 0; k < idList.length; k++) {
    // SmartHR_API 従業員_"取得"にリクエストを送信しレスポンスを取得
    const response = UrlFetchApp.fetch('https://'+SubDomain+'.daruma.space/api/v1/crews/' + idList[k], params)
    // レスポンスを文字列で取得
    const responseBody = response.getContentText()
    // jsonオブジェクトに変換
    const json = JSON.parse(responseBody)

    responseList.push(json);
  }

  return responseList;
}

/**
 * カオナビ_シート情報をシート名で参照し、該当するシート情報が存在することを確認する
 * 
 * array sheetsInfo カオナビAPIで取得したシート情報一覧
 * string 参照対象のシート名
 * 
 */
function checkSheetName(sheetsInfo, targetSheetName) {
  var list = {};
  for (let i = 0; i < sheetsInfo.length; i++) {
    if(sheetsInfo[i]['name'] == targetSheetName){
      list['id'] = sheetsInfo[i]['id'];
      list['custom_fields'] = sheetsInfo[i]['custom_fields'];
    }
  }
  if (typeof list == "undefined") {
    throw new Error("カオナビへの社員情報連携登録に失敗しました。\n連携登録対象のカオナビシート_" + targetSheetName + "が存在しません。");
  }

  return list;
}

/**
 * カオナビAPIへ値をリクエスト送信し、登録する社員の各種情報を登録する
 * 
 * array storeData (登録データ)
 * string methodType (post:メンバー新規登録 patch:各種シートへの情報登録)
 * integer sheetId カオナビ_シートID
 */
function requestApi(storeData, methodType, sheetId = null) {
  // カオナビAPI_トークン取得
  const token = getToken();

  let member_data = {
    "member_data" : storeData
  }

  //APIに必要な情報
  let apiOptions = {
    'headers' : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify(member_data),
    'method': methodType,
  }

  if (sheetId) {
    // 1～8
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/' + sheetId, apiOptions).getContentText())
    return json
  } else {
    // 0
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/members', apiOptions).getContentText());
    return json
  }
}
