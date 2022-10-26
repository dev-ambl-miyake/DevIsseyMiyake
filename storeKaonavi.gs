/**
 * 入社_SmartHRからカオナビへの社員情報連携登録処理
 * 
 * 社員番号入力_スプレッドシートに入力された社員番号と、
 * 履歴データ[登録用]_スプレッドシートに記載されている社員番号を照合し、
 * 一致した社員情報をSmartHR_APIより取得しカオナビへ登録する
 */
function createMember() {
  // 開始ログ
  log('入社_カオナビ連携登録', 's');

  const employeeIdList = createKaonaviIdList();
  if(!employeeIdList) {
    return
  }

  // 社員情報を取得
  const employeesData = createKaonaviEmployeeList(employeeIdList);
  log(JSON.stringify(employeesData, null, 5),'s');

  // データ格納用配列変数
  let basicInfoList = [];  // 基本情報
  let contactList = [];  // 連絡先
  let addressList = [];  // 住所
  let emergencyContactList = [];  // 緊急連絡先
  let bankList = [];  // 銀行口座
  let academicList = [];  // 学歴
  let languageList = [];  // 語学
  let licenseList = [];  // 免許・資格等
  let familyList = [];  // 家族情報

  // var test = kaonaviSheetsApi();
  // log(JSON.stringify(test, null, 5),'s');

  try{
    // 登録対象の社員人数分ループ参照
    for (var l = 0; l < employeesData.length; l++) {
      // 対象社員の家族情報を取得
      const employeeFamilyData = callShrFamilyApi(employeesData[l]['id']);
      // log(JSON.stringify(employeeFamilyData, null, 5),'s', "s");

      // SmartHR_各種カスタム項目_整形用配列
      // 学歴
      var academicHistoryData = [];
      // 英語
      var englishData = [];
      // 英語(スピーキング)
      var englishSpeakingData = [];
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
          // 学歴
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("academicHistoryGroupId")) {
            academicHistoryData.push(employeesData[l]['custom_fields'][cl]);
          }
          // 英語
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("englishGroupId")) {
            englishData.push(employeesData[l]['custom_fields'][cl]);
          }
          // 英語(スピーキング)
          if (employeesData[l]['custom_fields'][cl]['template']['group_id'] == getProperties("englishSpeakingGroupId")) {
            englishSpeakingData.push(employeesData[l]['custom_fields'][cl]);
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

      // 連絡先
      var email = employeesData[l]['email'];
      var telNumber = employeesData[l]['tel_number'];

      // 現住所
      var zipCode = employeesData[l]['address'] ? employeesData[l]['address']['zip_code'] : null;
      var pref = employeesData[l]['address'] ? employeesData[l]['address']['pref'] : null;
      var city = employeesData[l]['address'] ? employeesData[l]['address']['city'] : null;
      var street = employeesData[l]['address'] ? employeesData[l]['address']['street'] : null;
      var building = employeesData[l]['address'] ? employeesData[l]['address']['building'] : null;
      var countryNumber = employeesData[l]['address'] ? employeesData[l]['address']['country_number'] : null;

      // 緊急連絡先
      var emergencyRelationName = employeesData[l]['emergency_relation_name'];
      var emergencyName = employeesData[l]['emergency_last_name'] + "　" +  employeesData[l]['emergency_first_name'];
      var emergencyNameKana = employeesData[l]['emergency_last_name_yomi'] + "　" +  employeesData[l]['emergency_first_name_yomi'];
      var emergencyTelNumber = employeesData[l]['emergency_tel_number'];
      var emergencyAddressZipcode = employeesData[l]['emergency_address'] ? employeesData[l]['emergency_address']['zip_code'] : null;
      var emergencyAddressPref = employeesData[l]['emergency_address'] ? employeesData[l]['emergency_address']['pref'] : null;
      var emergencyAddressCity = employeesData[l]['emergency_address'] ? employeesData[l]['emergency_address']['city'] : null;
      var emergencyAddressStreet = employeesData[l]['emergency_address'] ? employeesData[l]['emergency_address']['street'] : null;
      var emergencyAddressBuilding = employeesData[l]['emergency_address'] ? employeesData[l]['emergency_address']['building'] : null;

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
      // var inhouseEnglishTestName = null;
      // var inhouseEnglishTestScore = null;
      // var inhouseEnglishTestDate = null;
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
      if (englishSpeakingData.length > 0) {
        for (var esl = 0; esl < englishSpeakingData.length; esl++) {
          // // 英語（社内テスト）_テスト名
          // if (englishSpeakingData[ahl]['template']['name'] == "バーサントスコア") {
          //   inhouseEnglishTestName = englishSpeakingData[esl]['value'];
          // }
          // // 英語（社内テスト）_スコア
          // if (englishSpeakingData[ahl]['template']['name'] == "バーサント受験日") {
          //   inhouseEnglishTestScore = englishSpeakingData[esl]['value'];
          // }
          // // 英語（社内テスト）_受験日
          // if (englishSpeakingData[ahl]['template']['name'] == "P360受験日") {
          //   inhouseEnglishTestDate = englishSpeakingData[esl]['value'];
          // }
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
          // SmartHR側はstring、カオナビ側はnumber(integer)のため、どちらかの型に統一する必要がある
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
      var licenseName = null;
      var licenseAcquisitionDate = null;
      var knowledgeName = null;
      var knowledgeAcquisitionDate = null;

      if (licenseData.length > 0) {
        for (var ll = 0; ll < licenseData.length; ll++) {
          // 免許・資格名
          if (licenseData[ll]['template']['name'] == "免許・資格名") {
            for (var lelm = 0; lelm < licenseData[ll]['template']['elements'].length; lelm++) {
              if (licenseData[ll]['value'] == licenseData[ll]['template']['elements'][lelm]['id']) {
                licenseName = licenseData[ll]['template']['elements'][lelm]['name'];
              }
            }
          }
          // 取得年月日
          if (licenseData[ll]['template']['name'] == "取得年月日") {
            licenseAcquisitionDate = licenseData[ll]['value'];
          }
        }
      }
      if (knowledgeData.length > 0) {
        for (var kl = 0; kl < knowledgeData.length; kl++) {
          // 知識・技能名
          if (knowledgeData[kl]['template']['name'] == "知識・技能名") {
            for (var kelm = 0; kelm < knowledgeData[kl]['template']['elements'].length; kelm++) {
              if (knowledgeData[kl]['value'] == knowledgeData[kl]['template']['elements'][kelm]['id']) {
                knowledgeName = knowledgeData[kl]['template']['elements'][kelm]['name'];
              }
            }
          }
          // 取得年月日
          if (knowledgeData[kl]['template']['name'] == "取得年月日") {
            knowledgeAcquisitionDate = knowledgeData[kl]['value'];
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
        if (employeeFamilyData[efl]['live_together_type'] === "living_together ") {
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
        // 採用形態
      }

      /* 連絡先 */
      let contact = {
        "code" : employeeNumber,  // 社員番号
        "records" : [
          {
            "custom_fields" : [
              // メールアドレス
              {
                "id" : 5552,
                "values": [ email ]
              },
              // 電話番号
              {
                "id" : 5553,
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
                "id" : 5537,
                "values": [ zipCode ]
              },
              // 現住所（都道府県）
              {
                "id" : 5823,
                "values": [ pref ]
              },
              // 現住所（市区町村）
              {
                "id" : 5539,
                "values": [ city ]
              },
              // 現住所（丁目・番地）
              {
                "id" : 5540,
                "values": [ street ]
              },
              // 現住所（建物名・部屋番号）
              {
                "id" : 5541,
                "values": [ building ]
              },
              // 現住所（国コード）
              {
                "id" : 5542,
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
                "id" : 5543,
                "values": [ emergencyRelationName ]
              },
              // 緊急連絡先の氏名
              {
                "id" : 5544,
                "values": [ emergencyName ]
              },
              // 緊急連絡先のフリガナ
              {
                "id" : 5545,
                "values": [ emergencyNameKana ]
              },
              // 緊急連絡先の電話番号
              {
                "id" : 5546,
                "values": [ emergencyTelNumber ]
              },
              // 緊急連絡先の郵便番号
              {
                "id" : 5547,
                "values": [ emergencyAddressZipcode ]
              },
              // 緊急連絡先の都道府県
              {
                "id" : 5548,
                "values": [ emergencyAddressPref ]
              },
              // 緊急連絡先の市区町村
              {
                "id" : 5549,
                "values": [ emergencyAddressCity ]
              },
              // 緊急連絡先の丁目・番地
              {
                "id" : 5550,
                "values": [ emergencyAddressStreet ]
              },
              // 緊急連絡先の建物名・部屋番号
              {
                "id" : 5551,
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
                "id" : 5554,
                "values": [ bankCode ]
              },
              // 支店コード
              {
                "id" : 5555,
                "values": [ bankBranchCode ]
              },
              // 預金種別
              {
                "id" : 5556,
                "values": [ accountType ]
              },
              // 口座番号
              {
                "id" : 5557,
                "values": [ accountNumber ]
              },
              // 名義（カタカナ）
              {
                "id" : 5558,
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
                "id" : 5559,
                "values": [ schoolCategory1 ]
              },
              // 学校2_学校分類
              {
                "id" : 5565,
                "values": [ schoolCategory2 ]
              },
              // 学校3_学校分類
              {
                "id" : 5571,
                "values": [ schoolCategory3 ]
              },
              // 学校4_学校分類
              {
                "id" : 5577,
                "values": [ schoolCategory4 ]
              },
              // 学校5_学校分類
              {
                "id" : 5583,
                "values": [ schoolCategory5 ]
              },
              // 学校1_学校名
              {
                "id" : 5560,
                "values": [ schoolName1 ]
              },
              // 学校2_学校名
              {
                "id" : 5566,
                "values": [ schoolName2 ]
              },
              // 学校3_学校名
              {
                "id" : 5572,
                "values": [ schoolName3 ]
              },
              // 学校4_学校名
              {
                "id" : 5578,
                "values": [ schoolName4 ]
              },
              // 学校5_学校名
              {
                "id" : 5584,
                "values": [ schoolName5 ]
              },
              // 学校1_学部・学科・コース
              {
                "id" : 5561,
                "values": [ schoolDepartment1 ]
              },
              // 学校2_学部・学科・コース
              {
                "id" : 5567,
                "values": [ schoolDepartment2 ]
              },
              // 学校3_学部・学科・コース
              {
                "id" : 5573,
                "values": [ schoolDepartment3 ]
              },
              // 学校4_学部・学科・コース
              {
                "id" : 5579,
                "values": [ schoolDepartment4 ]
              },
              // 学校5_学部・学科・コース
              {
                "id" : 5585,
                "values": [ schoolDepartment5 ]
              },
              // 学校1_専攻科目ジャンル
              {
                "id" : 5824,
                "values": [ schoolMajor1 ]
              },
              // 学校2_専攻科目ジャンル
              {
                "id" : 5825,
                "values": [ schoolMajor2 ]
              },
              // 学校3_専攻科目ジャンル
              {
                "id" : 5826,
                "values": [ schoolMajor3 ]
              },
              // 学校4_専攻科目ジャンル
              {
                "id" : 5827,
                "values": [ schoolMajor4 ]
              },
              // 学校5_専攻科目ジャンル
              {
                "id" : 5828,
                "values": [ schoolMajor5 ]
              },
              // 学校1_入学年月日
              {
                "id" : 5562,
                "values": [ schoolEnteredDate1 ]
              },
              // 学校2_入学年月日
              {
                "id" : 5568,
                "values": [ schoolEnteredDate2 ]
              },
              // 学校3_入学年月日
              {
                "id" : 5574,
                "values": [ schoolEnteredDate3 ]
              },
              // 学校4_入学年月日
              {
                "id" : 5580,
                "values": [ schoolEnteredDate4 ]
              },
              // 学校5_入学年月日
              {
                "id" : 5586,
                "values": [ schoolEnteredDate5 ]
              },
              // 学校1_卒業・中退
              {
                "id" : 5563,
                "values": [ graduatedAndDropout1 ]
              },
              // 学校2_卒業・中退
              {
                "id" : 5569,
                "values": [ graduatedAndDropout2 ]
              },
              // 学校3_卒業・中退
              {
                "id" : 5575,
                "values": [ graduatedAndDropout3 ]
              },
              // 学校4_卒業・中退
              {
                "id" : 5581,
                "values": [ graduatedAndDropout4 ]
              },
              // 学校5_卒業・中退
              {
                "id" : 5587,
                "values": [ graduatedAndDropout5 ]
              },
              // 学校1_卒業・中退年月日
              {
                "id" : 5564,
                "values": [ graduatedAndDropoutDate1 ]
              },
              // 学校2_卒業・中退年月日
              {
                "id" : 5570,
                "values": [ graduatedAndDropoutDate2 ]
              },
              // 学校3_卒業・中退年月日
              {
                "id" : 5576,
                "values": [ graduatedAndDropoutDate3 ]
              },
              // 学校4_卒業・中退年月日
              {
                "id" : 5582,
                "values": [ graduatedAndDropoutDate4 ]
              },
              // 学校5_卒業・中退年月日
              {
                "id" : 5588,
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
            // 英語（社内テスト）_テスト名・英語（社内テスト）_スコア・英語（社内テスト）_受験日の３つは、
            // SmartHR側のP360 or バーサントのどちらの情報を登録するべきか要確認
            "custom_fields" : [
              // 英語（社内テスト）_テスト名
              // {
              //   "id" : 5589,
              //   "values": [ bankCode ]
              // },
              // 英語（社内テスト）_スコア
              // {
              //   "id" : 5590,
              //   "values": [ bankBranchCode ]
              // },
              // 英語（社内テスト）_受験日
              // {
              //   "id" : 5591,
              //   "values": [ accountType ]
              // },
              // 英語_試験名
              {
                "id" : 5592,
                "values": [ englishTestName ]
              },
              // 英語_スコア
              {
                "id" : 5593,
                "values": [ englishTestScore ]
              },
              // 英語_受験日
              {
                "id" : 5594,
                "values": [ englishTestDate ]
              },
              // その他外国語①_語学名
              {
                "id" : 5595,
                "values": [ otherLanguageName1 ]
              },
              // その他外国語①_級・スコア等
              {
                "id" : 5596,
                "values": [ otherLanguageScore1 ]
              },
              // その他外国語①_取得年月日
              {
                "id" : 5597,
                "values": [ otherLanguageAcquisitionDate1 ]
              },
              // その他外国語②_語学名
              {
                "id" : 5598,
                "values": [ otherLanguageName2 ]
              },
              // その他外国語②_級・スコア等
              {
                "id" : 5599,
                "values": [ otherLanguageScore2 ]
              },
              // その他外国語②_取得年月日
              {
                "id" : 5600,
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
              // 免許名・資格名①
              {
                "id" : 5601,
                "values": [ licenseName ]
              },
              // 免許・資格.取得年月日①
              {
                "id" : 5602,
                "values": [ licenseAcquisitionDate ]
              },
              // 知識・技能名①
              {
                "id" : 5605,
                "values": [ knowledgeName ]
              },
              // 知識・技能.取得年月日②
              {
                "id" : 5606,
                "values": [ knowledgeAcquisitionDate ]
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
              // 家族1 続柄
              {
                "id" : 5644,
                "values": [ familyData[1]['familyRelationship'] ]
              },
              // 家族2 続柄
              {
                "id" : 5659,
                "values": [ familyData[2]['familyRelationship'] ]
              },
              // 家族3 続柄
              {
                "id" : 5674,
                "values": [ familyData[3]['familyRelationship'] ]
              },
              // 家族4 続柄
              {
                "id" : 5689,
                "values": [ familyData[4]['familyRelationship'] ]
              },
              // 家族5 続柄
              {
                "id" : 5704,
                "values": [ familyData[5]['familyRelationship'] ]
              },
              // 家族6 続柄
              {
                "id" : 5719,
                "values": [ familyData[6]['familyRelationship'] ]
              },
              // 家族7 続柄
              {
                "id" : 5609,
                "values": [ familyData[7]['familyRelationship'] ]
              },
              // 家族8 続柄
              {
                "id" : 5734,
                "values": [ familyData[8]['familyRelationship'] ]
              },
              // 家族9 続柄
              {
                "id" : 5749,
                "values": [ familyData[9]['familyRelationship'] ]
              },
              // 家族10 続柄
              {
                "id" : 5764,
                "values": [ familyData[10]['familyRelationship'] ]
              },
              // 家族1 姓
              {
                "id" : 5645,
                "values": [ familyData[1]['familyLastName'] ]
              },
              // 家族2 姓
              {
                "id" : 5660,
                "values": [ familyData[2]['familyLastName'] ]
              },
              // 家族3 姓
              {
                "id" : 5675,
                "values": [ familyData[3]['familyLastName'] ]
              },
              // 家族4 姓
              {
                "id" : 5690,
                "values": [ familyData[4]['familyLastName'] ]
              },
              // 家族5 姓
              {
                "id" : 5705,
                "values": [ familyData[5]['familyLastName'] ]
              },
              // 家族6 姓
              {
                "id" : 5720,
                "values": [ familyData[6]['familyLastName'] ]
              },
              // 家族7 姓
              {
                "id" : 5610,
                "values": [ familyData[7]['familyLastName'] ]
              },
              // 家族8 姓
              {
                "id" : 5735,
                "values": [ familyData[8]['familyLastName'] ]
              },
              // 家族9 姓
              {
                "id" : 5750,
                "values": [ familyData[9]['familyLastName'] ]
              },
              // 家族10 姓
              {
                "id" : 5765,
                "values": [ familyData[10]['familyLastName'] ]
              },
              // 家族1 名
              {
                "id" : 5646,
                "values": [ familyData[1]['familyFirstName'] ]
              },
              // 家族2 名
              {
                "id" : 5661,
                "values": [ familyData[2]['familyFirstName'] ]
              },
              // 家族3 名
              {
                "id" : 5676,
                "values": [ familyData[3]['familyFirstName'] ]
              },
              // 家族4 名
              {
                "id" : 5691,
                "values": [ familyData[4]['familyFirstName'] ]
              },
              // 家族5 名
              {
                "id" : 5706,
                "values": [ familyData[5]['familyFirstName'] ]
              },
              // 家族6 名
              {
                "id" : 5721,
                "values": [ familyData[6]['familyFirstName'] ]
              },
              // 家族7 名
              {
                "id" : 5611,
                "values": [ familyData[7]['familyFirstName'] ]
              },
              // 家族8 名
              {
                "id" : 5736,
                "values": [ familyData[8]['familyFirstName'] ]
              },
              // 家族9 名
              {
                "id" : 5751,
                "values": [ familyData[9]['familyFirstName'] ]
              },
              // 家族10 名
              {
                "id" : 5766,
                "values": [ familyData[10]['familyFirstName'] ]
              },
              // 家族1 姓（ヨミガナ）
              {
                "id" : 5647,
                "values": [ familyData[1]['familyLastNameKana'] ]
              },
              // 家族2 姓（ヨミガナ）
              {
                "id" : 5662,
                "values": [ familyData[2]['familyLastNameKana'] ]
              },
              // 家族3 姓（ヨミガナ）
              {
                "id" : 5677,
                "values": [ familyData[3]['familyLastNameKana'] ]
              },
              // 家族4 姓（ヨミガナ）
              {
                "id" : 5692,
                "values": [ familyData[4]['familyLastNameKana'] ]
              },
              // 家族5 姓（ヨミガナ）
              {
                "id" : 5707,
                "values": [ familyData[5]['familyLastNameKana'] ]
              },
              // 家族6 姓（ヨミガナ）
              {
                "id" : 5722,
                "values": [ familyData[6]['familyLastNameKana'] ]
              },
              // 家族7 姓（ヨミガナ）
              {
                "id" : 5612,
                "values": [ familyData[7]['familyLastNameKana'] ]
              },
              // 家族8 姓（ヨミガナ）
              {
                "id" : 5737,
                "values": [ familyData[8]['familyLastNameKana'] ]
              },
              // 家族9 姓（ヨミガナ）
              {
                "id" : 5752,
                "values": [ familyData[9]['familyLastNameKana'] ]
              },
              // 家族10 姓（ヨミガナ）
              {
                "id" : 5767,
                "values": [ familyData[10]['familyLastNameKana'] ]
              },
              // 家族1 名（ヨミガナ）
              {
                "id" : 5648,
                "values": [ familyData[1]['familyFirstNameKana'] ]
              },
              // 家族2 名（ヨミガナ）
              {
                "id" : 5663,
                "values": [ familyData[2]['familyFirstNameKana'] ]
              },
              // 家族3 名（ヨミガナ）
              {
                "id" : 5678,
                "values": [ familyData[3]['familyFirstNameKana'] ]
              },
              // 家族4 名（ヨミガナ）
              {
                "id" : 5693,
                "values": [ familyData[4]['familyFirstNameKana'] ]
              },
              // 家族5 名（ヨミガナ）
              {
                "id" : 5708,
                "values": [ familyData[5]['familyFirstNameKana'] ]
              },
              // 家族6 名（ヨミガナ）
              {
                "id" : 5723,
                "values": [ familyData[6]['familyFirstNameKana'] ]
              },
              // 家族7 名（ヨミガナ）
              {
                "id" : 5613,
                "values": [ familyData[7]['familyFirstNameKana'] ]
              },
              // 家族8 名（ヨミガナ）
              {
                "id" : 5738,
                "values": [ familyData[8]['familyFirstNameKana'] ]
              },
              // 家族9 名（ヨミガナ）
              {
                "id" : 5753,
                "values": [ familyData[9]['familyFirstNameKana'] ]
              },
              // 家族10 名（ヨミガナ）
              {
                "id" : 5768,
                "values": [ familyData[10]['familyFirstNameKana'] ]
              },
              // 家族1 生年月日
              {
                "id" : 5650,
                "values": [ familyData[1]['familyBirthday'] ]
              },
              // 家族2 生年月日
              {
                "id" : 5665,
                "values": [ familyData[2]['familyBirthday'] ]
              },
              // 家族3 生年月日
              {
                "id" : 5680,
                "values": [ familyData[3]['familyBirthday'] ]
              },
              // 家族4 生年月日
              {
                "id" : 5695,
                "values": [ familyData[4]['familyBirthday'] ]
              },
              // 家族5 生年月日
              {
                "id" : 5710,
                "values": [ familyData[5]['familyBirthday'] ]
              },
              // 家族6 生年月日
              {
                "id" : 5725,
                "values": [ familyData[6]['familyBirthday'] ]
              },
              // 家族7 生年月日
              {
                "id" : 5615,
                "values": [ familyData[7]['familyBirthday'] ]
              },
              // 家族8 生年月日
              {
                "id" : 5740,
                "values": [ familyData[8]['familyBirthday'] ]
              },
              // 家族9 生年月日
              {
                "id" : 5755,
                "values": [ familyData[9]['familyBirthday'] ]
              },
              // 家族10 生年月日
              {
                "id" : 5770,
                "values": [ familyData[10]['familyBirthday'] ]
              },
              // 家族1 性別
              {
                "id" : 5649,
                "values": [ familyData[1]['familyGender'] ]
              },
              // 家族2 性別
              {
                "id" : 5664,
                "values": [ familyData[2]['familyGender'] ]
              },
              // 家族3 性別
              {
                "id" : 5679,
                "values": [ familyData[3]['familyGender'] ]
              },
              // 家族4 性別
              {
                "id" : 5694,
                "values": [ familyData[4]['familyGender'] ]
              },
              // 家族5 性別
              {
                "id" : 5709,
                "values": [ familyData[5]['familyGender'] ]
              },
              // 家族6 性別
              {
                "id" : 5724,
                "values": [ familyData[6]['familyGender'] ]
              },
              // 家族7 性別
              {
                "id" : 5614,
                "values": [ familyData[7]['familyGender'] ]
              },
              // 家族8 性別
              {
                "id" : 5739,
                "values": [ familyData[8]['familyGender'] ]
              },
              // 家族9 性別
              {
                "id" : 5754,
                "values": [ familyData[9]['familyGender'] ]
              },
              // 家族10 性別
              {
                "id" : 5769,
                "values": [ familyData[10]['familyGender'] ]
              },
              // 家族1 職業
              {
                "id" : 5652,
                "values": [ familyData[1]['familyJob'] ]
              },
              // 家族2 職業
              {
                "id" : 5667,
                "values": [ familyData[2]['familyJob'] ]
              },
              // 家族3 職業
              {
                "id" : 5682,
                "values": [ familyData[3]['familyJob'] ]
              },
              // 家族4 職業
              {
                "id" : 5697,
                "values": [ familyData[4]['familyJob'] ]
              },
              // 家族5 職業
              {
                "id" : 5712,
                "values": [ familyData[5]['familyJob'] ]
              },
              // 家族6 職業
              {
                "id" : 5727,
                "values": [ familyData[6]['familyJob'] ]
              },
              // 家族7 職業
              {
                "id" : 5617,
                "values": [ familyData[7]['familyJob'] ]
              },
              // 家族8 職業
              {
                "id" : 5742,
                "values": [ familyData[8]['familyJob'] ]
              },
              // 家族9 職業
              {
                "id" : 5757,
                "values": [ familyData[9]['familyJob'] ]
              },
              // 家族10 職業
              {
                "id" : 5772,
                "values": [ familyData[10]['familyJob'] ]
              },
              // 家族1 同居・別居
              {
                "id" : 5653,
                "values": [ familyData[1]['familyLiveTogether'] ]
              },
              // 家族2 同居・別居
              {
                "id" : 5668,
                "values": [ familyData[2]['familyLiveTogether'] ]
              },
              // 家族3 同居・別居
              {
                "id" : 5683,
                "values": [ familyData[3]['familyLiveTogether'] ]
              },
              // 家族4 同居・別居
              {
                "id" : 5698,
                "values": [ familyData[4]['familyLiveTogether'] ]
              },
              // 家族5 同居・別居
              {
                "id" : 5713,
                "values": [ familyData[5]['familyLiveTogether'] ]
              },
              // 家族6 同居・別居
              {
                "id" : 5728,
                "values": [ familyData[6]['familyLiveTogether'] ]
              },
              // 家族7 同居・別居
              {
                "id" : 5618,
                "values": [ familyData[7]['familyLiveTogether'] ]
              },
              // 家族8 同居・別居
              {
                "id" : 5743,
                "values": [ familyData[8]['familyLiveTogether'] ]
              },
              // 家族9 同居・別居
              {
                "id" : 5758,
                "values": [ familyData[9]['familyLiveTogether'] ]
              },
              // 家族10 同居・別居
              {
                "id" : 5773,
                "values": [ familyData[10]['familyLiveTogether'] ]
              },
              // 家族1 住所（郵便番号）
              {
                "id" : 5654,
                "values": [ familyData[1]['familyZipCode'] ]
              },
              // 家族2 住所（郵便番号）
              {
                "id" : 5669,
                "values": [ familyData[2]['familyZipCode'] ]
              },
              // 家族3 住所（郵便番号）
              {
                "id" : 5684,
                "values": [ familyData[3]['familyZipCode'] ]
              },
              // 家族4 住所（郵便番号）
              {
                "id" : 5699,
                "values": [ familyData[4]['familyZipCode'] ]
              },
              // 家族5 住所（郵便番号）
              {
                "id" : 5714,
                "values": [ familyData[5]['familyZipCode'] ]
              },
              // 家族6 住所（郵便番号）
              {
                "id" : 5729,
                "values": [ familyData[6]['familyZipCode'] ]
              },
              // 家族7 住所（郵便番号）
              {
                "id" : 5619,
                "values": [ familyData[7]['familyZipCode'] ]
              },
              // 家族8 住所（郵便番号）
              {
                "id" : 5744,
                "values": [ familyData[8]['familyZipCode'] ]
              },
              // 家族9 住所（郵便番号）
              {
                "id" : 5759,
                "values": [ familyData[9]['familyZipCode'] ]
              },
              // 家族10 住所（郵便番号）
              {
                "id" : 5774,
                "values": [ familyData[10]['familyZipCode'] ]
              },
              // 家族1 住所（都道府県）
              {
                "id" : 5884,
                "values": [ familyData[1]['familyPref'] ]
              },
              // 家族2 住所（都道府県）
              {
                "id" : 5885,
                "values": [ familyData[2]['familyPref'] ]
              },
              // 家族3 住所（都道府県）
              {
                "id" : 5886,
                "values": [ familyData[3]['familyPref'] ]
              },
              // 家族4 住所（都道府県）
              {
                "id" : 5887,
                "values": [ familyData[4]['familyPref'] ]
              },
              // 家族5 住所（都道府県）
              {
                "id" : 5888,
                "values": [ familyData[5]['familyPref'] ]
              },
              // 家族6 住所（都道府県）
              {
                "id" : 5889,
                "values": [ familyData[6]['familyPref'] ]
              },
              // 家族7 住所（都道府県）
              {
                "id" : 5890,
                "values": [ familyData[7]['familyPref'] ]
              },
              // 家族8 住所（都道府県）
              {
                "id" : 5891,
                "values": [ familyData[8]['familyPref'] ]
              },
              // 家族9 住所（都道府県）
              {
                "id" : 5892,
                "values": [ familyData[9]['familyPref'] ]
              },
              // 家族10 住所（都道府県）
              {
                "id" : 5893,
                "values": [ familyData[10]['familyPref'] ]
              },
              // 家族1 住所（市区町村）
              {
                "id" : 5656,
                "values": [ familyData[1]['familyCity'] ]
              },
              // 家族2 住所（市区町村）
              {
                "id" : 5671,
                "values": [ familyData[2]['familyCity'] ]
              },
              // 家族3 住所（市区町村）
              {
                "id" : 5686,
                "values": [ familyData[3]['familyCity'] ]
              },
              // 家族4 住所（市区町村）
              {
                "id" : 5701,
                "values": [ familyData[4]['familyCity'] ]
              },
              // 家族5 住所（市区町村）
              {
                "id" : 5716,
                "values": [ familyData[5]['familyCity'] ]
              },
              // 家族6 住所（市区町村）
              {
                "id" : 5731,
                "values": [ familyData[6]['familyCity'] ]
              },
              // 家族7 住所（市区町村）
              {
                "id" : 5621,
                "values": [ familyData[7]['familyCity'] ]
              },
              // 家族8 住所（市区町村）
              {
                "id" : 5746,
                "values": [ familyData[8]['familyCity'] ]
              },
              // 家族9 住所（市区町村）
              {
                "id" : 5761,
                "values": [ familyData[9]['familyCity'] ]
              },
              // 家族10 住所（市区町村）
              {
                "id" : 5776,
                "values": [ familyData[10]['familyCity'] ]
              },
              // 家族1 住所（丁目・番地）
              {
                "id" : 5657,
                "values": [ familyData[1]['familyStreet'] ]
              },
              // 家族2 住所（丁目・番地）
              {
                "id" : 5672,
                "values": [ familyData[2]['familyStreet'] ]
              },
              // 家族3 住所（丁目・番地）
              {
                "id" : 5687,
                "values": [ familyData[3]['familyStreet'] ]
              },
              // 家族4 住所（丁目・番地）
              {
                "id" : 5702,
                "values": [ familyData[4]['familyStreet'] ]
              },
              // 家族5 住所（丁目・番地）
              {
                "id" : 5717,
                "values": [ familyData[5]['familyStreet'] ]
              },
              // 家族6 住所（丁目・番地）
              {
                "id" : 5732,
                "values": [ familyData[6]['familyStreet'] ]
              },
              // 家族7 住所（丁目・番地）
              {
                "id" : 5622,
                "values": [ familyData[7]['familyStreet'] ]
              },
              // 家族8 住所（丁目・番地）
              {
                "id" : 5747,
                "values": [ familyData[8]['familyStreet'] ]
              },
              // 家族9 住所（丁目・番地）
              {
                "id" : 5762,
                "values": [ familyData[9]['familyStreet'] ]
              },
              // 家族10 住所（丁目・番地）
              {
                "id" : 5777,
                "values": [ familyData[10]['familyStreet'] ]
              },
              // 家族1 住所（建物名・部屋番号）
              {
                "id" : 5658,
                "values": [ familyData[1]['familyBuilding'] ]
              },
              // 家族2 住所（建物名・部屋番号）
              {
                "id" : 5673,
                "values": [ familyData[2]['familyBuilding'] ]
              },
              // 家族3 住所（建物名・部屋番号）
              {
                "id" : 5688,
                "values": [ familyData[3]['familyBuilding'] ]
              },
              // 家族4 住所（建物名・部屋番号）
              {
                "id" : 5703,
                "values": [ familyData[4]['familyBuilding'] ]
              },
              // 家族5 住所（建物名・部屋番号）
              {
                "id" : 5718,
                "values": [ familyData[5]['familyBuilding'] ]
              },
              // 家族6 住所（建物名・部屋番号）
              {
                "id" : 5733,
                "values": [ familyData[6]['familyBuilding'] ]
              },
              // 家族7 住所（建物名・部屋番号）
              {
                "id" : 5623,
                "values": [ familyData[7]['familyBuilding'] ]
              },
              // 家族8 住所（建物名・部屋番号）
              {
                "id" : 5748,
                "values": [ familyData[8]['familyBuilding'] ]
              },
              // 家族9 住所（建物名・部屋番号）
              {
                "id" : 5763,
                "values": [ familyData[9]['familyBuilding'] ]
              },
              // 家族10 住所（建物名・部屋番号）
              {
                "id" : 5778,
                "values": [ familyData[10]['familyBuilding'] ]
              },
              // 家族1 電話番号
              {
                "id" : 5651,
                "values": [ familyData[1]['familyTelNumber'] ]
              },
              // 家族2 電話番号
              {
                "id" : 5666,
                "values": [ familyData[2]['familyTelNumber'] ]
              },
              // 家族3 電話番号
              {
                "id" : 5681,
                "values": [ familyData[3]['familyTelNumber'] ]
              },
              // 家族4 電話番号
              {
                "id" : 5696,
                "values": [ familyData[4]['familyTelNumber'] ]
              },
              // 家族5 電話番号
              {
                "id" : 5711,
                "values": [ familyData[5]['familyTelNumber'] ]
              },
              // 家族6 電話番号
              {
                "id" : 5726,
                "values": [ familyData[6]['familyTelNumber'] ]
              },
              // 家族7 電話番号
              {
                "id" : 5616,
                "values": [ familyData[7]['familyTelNumber'] ]
              },
              // 家族8 電話番号
              {
                "id" : 5741,
                "values": [ familyData[8]['familyTelNumber'] ]
              },
              // 家族9 電話番号
              {
                "id" : 5756,
                "values": [ familyData[9]['familyTelNumber'] ]
              },
              // 家族10 電話番号
              {
                "id" : 5771,
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

    // todo::「既に登録済み」のエラーコードが返却された際のエラーハンドリングを実装すること
    const basicInfoResult = requestApi(basicInfoList, 0, "post");

    // 社員情報の登録にタイムラグが存在するため待機時間を調整
    Utilities.sleep(60000)

    // // 取得APIを取得
    // const employees_api = kaonaviMemberApi(); // カオナビの全従業員情報API
    // const member_list = employees_api['member_data']; // カオナビの全従業員情報リスト
    // log(JSON.stringify(member_list, null, 5),'s');

    const contactResult = requestApi(contactList, 1, "patch");
    const addressResult = requestApi(addressList, 2, "patch");
    const emergencyContactResult = requestApi(emergencyContactList, 3, "patch");
    const bankResult = requestApi(bankList, 4, "patch");
    const academicResult = requestApi(academicList, 5, "patch");
    // const languageResult = requestApi(languageList, 6, "patch");
    const licenseResult = requestApi(licenseList, 7, "patch");
    const familyResult = requestApi(familyList, 8, "patch");

    // 終了ログ
  　log('入社_カオナビ連携登録', 'e');

    SpreadsheetApp.getUi().alert("カオナビへの社員情報登録が終了しました。");

  }catch(e) {
    console.log(e.message);
    // SpreadsheetApp.getUi().alert("カオナビへの社員情報登録に失敗しました。\n入力した社員番号が誤っている、もしくは既に登録されています。");
  }
}

// 社員番号を照合し、連携登録対象の社員ID一覧データ配列を生成する
function createKaonaviIdList() {
  try{
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
        SpreadsheetApp.getUi().alert("誤った社員番号が入力されています。");
        return false
      }
      
      return idList
    }
    SpreadsheetApp.getUi().alert("社員番号が入力されていません。");
    return false

  } catch(e) {
    SpreadsheetApp.getUi().alert("履歴データからのデータ取得に失敗しました。");
  }
}

// SmartHR_APIより社員IDを用いて社員情報を取得し、社員情報一覧配列データを生成する
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

  try{
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

  } catch(e) {
    SpreadsheetApp.getUi().alert("smartHRからのデータ取得に失敗しました。");
  }
}

/**
 * カオナビAPIへ値をリクエスト送信し、登録する社員の各種情報を登録する
 * 
 * array storeData
 * integer sheetType(0:基本情報 1:連絡先 2:住所 3:緊急連絡先 4:銀行口座 5:学歴 6:語学 7:免許・資格等 8:家族情報)
 * string methodType(post:メンバー新規登録 patch:各種シートへの情報登録)
 */
function requestApi(storeData, sheetType, methodType) {
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
  
  if (sheetType === 0) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/members', apiOptions).getContentText());
    console.log(json);
    return json
  } else if (sheetType === 1) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2081', apiOptions).getContentText())
    console.log(json);
    return json
  } else if (sheetType === 2) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2078', apiOptions).getContentText())
    console.log(json);
    return json
  } else if (sheetType === 3) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2080', apiOptions).getContentText())
    console.log(json);
    return json
  } else if (sheetType === 4) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2082', apiOptions).getContentText())
    console.log(json);
    return json
  } else if (sheetType === 5) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2083', apiOptions).getContentText())
    return json
  } else if (sheetType === 6) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2084', apiOptions).getContentText())
    return json
  } else if(sheetType === 7) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2085', apiOptions).getContentText())
    return json
  } else if(sheetType === 8) {
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2086', apiOptions).getContentText())
    return json
  }
}
