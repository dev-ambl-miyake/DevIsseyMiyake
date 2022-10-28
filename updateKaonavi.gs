function updateKaonavi() {
  // 更新対象社員選択_スプレッドシート情報の取得
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
        console.log(getData)
        let familyDate = getFamiliy(idList);

        let basicInfoList = [];//基本情報
        let contactList = [];//連絡先
        let addressList = [];//住所
        let emergencyContactList = [];//緊急連絡先
        let bankList = [];//銀行口座
        let academicList = [];//学歴
        let languageList = [];//語学
        let licenseList = [];//免許・資格等
        let familyList = [];//家族情報

        let changedDate = changeDate(getData, familyDate);
        console.log(changedDate)

        try{
          // 開始ログ
  　      commonFunction.log('更新カオナビ連携登録', 's');

          //データを作成 
          for(let i = 0; i < getData.length; i++) {
            //基本情報
            let basicInfo = {
              "code" : changedDate[i].code,
              "name" : changedDate[i].name,
              "name_kana" : changedDate[i].name_kana,
              "entered_date" : changedDate[i].entered_date,
              "gender" : changedDate[i].gender,
              "birthday" : changedDate[i].birthday
              //"採用形態" : 不明,
            }

            //連絡先
            let contact = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5552,
                      "values": [
                        changedDate[i].mail
                      ]//メールアドレス
                    },
                    {
                      "id" : 5553,
                      "values": [
                        changedDate[i].tel
                      ]//電話番号
                    }
                  ]
                }
              ]
            }

            //現住所シート
            let address = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5537,
                      "values": [
                        changedDate[i].presentAddress_postalCode
                      ]
                    },
                    {
                      "id" : 5538,
                      "values": [
                        changedDate[i].presentAddress_prefectures
                      ]
                    },
                    {
                      "id" : 5539,
                      "values": [
                        changedDate[i].presentAddress_municipalities
                      ]
                    },
                    {
                      "id" : 5540,
                      "values": [
                        changedDate[i].presentAddress_houseNumber
                      ]
                    },
                    {
                      "id" : 5541,
                      "values": [
                        changedDate[i].presentAddress_roomNumber
                      ]
                    },
                    {
                      "id" : 5542,
                      "values": [
                        changedDate[i].pressentAddress_countryCode
                      ]
                    }
                  ]
                }
              ]
            }

            //緊急連絡先
            let emergencyContact = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5543,
                      "values": [
                        changedDate[i].emergencyContact_relationship
                      ]//続柄
                    },
                    {
                      "id" : 5544,
                      "values": [
                        changedDate[i].emergencyContact_name
                      ]//氏名
                    },
                    {
                      "id" : 5545,
                      "values": [
                        changedDate[i].emergencyContact_name_kana
                      ]//氏名カナ
                    },
                    {
                      "id" : 5546,
                      "values": [
                        changedDate[i].emergencyContact_tel
                      ]//電話番号
                    },
                    {
                      "id" : 5547,
                      "values": [
                        changedDate[i].emergencyContact_postalCode
                      ]//郵便番号
                    },
                    {
                      "id" : 5548,
                      "values": [
                        changedDate[i].emergencyContact_prefectures
                      ]//都道府県
                    },
                    {
                      "id" : 5549,
                      "values": [
                        changedDate[i].emergencyContact_municipalities
                      ]//市区町村
                    },
                    {
                      "id" : 5550,
                      "values": [
                        changedDate[i].emergencyContact_houseNumber
                      ]//丁目・番地
                    },
                    {
                      "id" : 5551,
                      "values": [
                        changedDate[i].emergencyContact_roomNumber
                      ]//建物名・部屋番号
                    }
                  ]
                }
              ]
            }

            //銀行口座
            let bank = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5554,
                      "values": [
                        changedDate[i].bankCode
                      ]//銀行コード
                    },
                    {
                      "id" : 5555,
                      "values": [
                        changedDate[i].branchCode
                      ]//支店コード
                    },
                    {
                      "id" : 5556,
                      "values": [
                        changedDate[i].depositType
                      ]//預金種別
                    },
                    {
                      "id" : 5557,
                      "values": [
                        changedDate[i].accountNumber
                      ]//口座番号
                    },
                    {
                      "id" : 5558,
                      "values": [
                        changedDate[i].accountName
                      ]//名義(カタカナ)
                    }
                  ]
                }
              ]
            }

            //学歴
            let academic = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5559,
                      "values": [
                        changedDate[i].mail
                      ]//学校1_学校分類
                    },
                    {
                      "id" : 5560,
                      "values": [
                        changedDate[i].mail
                      ]//学校1_学校名
                    },
                    {
                      "id" : 5561,
                      "values": [
                        changedDate[i].mail
                      ]//学校1_学部・学科・コース
                    },
                    {
                      "id" : 5562,
                      "values": [
                        changedDate[i].mail
                      ]//学校1_入学年月日
                    },
                    {
                      "id" : 5563,
                      "values": [
                        changedDate[i].mail
                      ]//学校1_卒業・中退
                    },
                    {
                      "id" : 5564,
                      "values": [
                        changedDate[i].mail
                      ]//学校1_卒業・中退年月日
                    }
                  ]
                }
              ]
            }

            //語学
            let language = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5595,
                      "values": [
                        changedDate[i].mail
                      ]//その他外国語1_語学名
                    },
                    {
                      "id" : 5596,
                      "values": [
                        changedDate[i].mail
                      ]//その他外国語1_級・スコア
                    },
                    {
                      "id" : 5597,
                      "values": [
                        changedDate[i].mail
                      ]//その他外国語1_取得年月日
                    }
                  ]
                }
              ]
            }

            //免許・資格等
            let license = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5601,
                      "values": [
                        changedDate[i].mail
                      ]//免許・資格名1
                    },
                    {
                      "id" : 5602,
                      "values": [
                        changedDate[i].mail
                      ]//取得年月日（免許・資格）1
                    },
                    {
                      "id" : 5603,
                      "values": [
                        changedDate[i].mail
                      ]//免許・資格名2
                    },
                    {
                      "id" : 5604,
                      "values": [
                        changedDate[i].mail
                      ]//取得年月日（免許・資格）2
                    },
                    {
                      "id" : 5605,
                      "values": [
                        changedDate[i].mail
                      ]//知識・技能1
                    },
                    {
                      "id" : 5606,
                      "values": [
                        changedDate[i].mail
                      ]//取得年月日（知識・技能）1
                    },
                    {
                      "id" : 5607,
                      "values": [
                        changedDate[i].mail
                      ]//知識・技能2
                    },
                    {
                      "id" : 5608,
                      "values": [
                        changedDate[i].mail
                      ]//取得年月日（知識・技能）2
                    }
                  ]
                }
              ]
            }

            //家族情報
            let family = {
              "code" : changedDate[i].code,
              "records" : [
                {
                  "custom_fields" : [
                    {
                      "id" : 5609,
                      "values": [
                        changedDate[i].family_relationship1
                      ]//家族1_続柄
                    },
                    {
                      "id" : 5610,
                      "values": [
                        changedDate[i].family_lastName1
                      ]//家族1_姓
                    },
                    {
                      "id" : 5611,
                      "values": [
                        changedDate[i].family_firstName1
                      ]//家族1_名
                    },
                    {
                      "id" : 5612,
                      "values": [
                        changedDate[i].family_lastName1_kana
                      ]//家族1_姓（フリガナ）
                    },
                    {
                      "id" : 5613,
                      "values": [
                        changedDate[i].family_firstName1_kana
                      ]//家族1_名（フリガナ）
                    },
                    {
                      "id" : 5614,
                      "values": [
                        changedDate[i].family_gender1
                      ]//家族1_性別
                    },
                    {
                      "id" : 5615,
                      "values": [
                        changedDate[i].family_birthday1
                      ]//家族1_生年月日
                    },
                    {
                      "id" : 5616,
                      "values": [
                        changedDate[i].family_tel1
                      ]//家族1_電話番号
                    },
                    {
                      "id" : 5617,
                      "values": [
                        changedDate[i].family_job1
                      ]//家族1_職業
                    },
                    {
                      "id" : 5618,
                      "values": [
                        changedDate[i].living_together1
                      ]//家族1_同居・別居の別
                    },
                    {
                      "id" : 5619,
                      "values": [
                        changedDate[i].family_postalCode1
                      ]//家族1_住所（郵便番号）
                    },
                    {
                      "id" : 5620,
                      "values": [
                        changedDate[i].family_prefectures1
                      ]//家族1_住所（都道府県）
                    },
                    {
                      "id" : 5621,
                      "values": [
                        changedDate[i].family_municipalities1
                      ]//家族1_住所（市区町村）
                    },
                    {
                      "id" : 5622,
                      "values": [
                        changedDate[i].family_houseNumber1
                      ]//家族1_住所（丁目・番地）
                    },
                    {
                      "id" : 5623,
                      "values": [
                        changedDate[i].family_roomNumber1
                      ]//家族1_住所（建物名・部屋番号）
                    }
                  ]
                }
              ]
            }

            basicInfoList.push(basicInfo)
            contactList.push(contact)
            addressList.push(address)
            emergencyContactList.push(emergencyContact)
            bankList.push(bank)
            academicList.push(academic)
            languageList.push(language)
            licenseList.push(license)
            familyList.push(family)

          }

          let json = api(basicInfoList, 0);
          api(contactList, 1)
          api(addressList, 2)
          api(emergencyContactList, 3)
          api(bankList, 4)
          api(academicList, 5)
          api(languageList, 6)
          api(licenseList, 7)
          api(familyList, 8)
 

          let errorMessage = "";
          //errorが発生していたら
          if(json.errors) {
            for(let j = 0; j < json.errors.length; j++) {
              errorMessage += json.errors[j] + "\n";
            }
            commonFunction.alert(errorMessage)
            return
          }

          //ステータスを済に変更
          changeStatus(1);
          commonFunction.alert("更新が完了しました。")

          //終了ログ
          commonFunction.log('更新カオナビ連携登録', 'e')
        }catch(e) {
          console.log("error")
        }
      }
    }
  }
}





function changeDate(getData, familyDate) {
  let changedDate = []

  for(let i = 0; i < getData.length; i++) {
    changedDate[i] = {
      "code" : getData[i].emp_code,
      "name" : getData[i].business_last_name + "　" + getData[i].business_first_name,
      "name_kana": getData[i].business_last_name_yomi + "　" + getData[i].business_first_name_yomi,
      "last_name" : getData[i].last_name,
      "first_name" : getData[i].first_name,
      "last_name_kana" : getData[i].last_name_yomi,
      "first_name_kana": getData[i].first_name_yomi,
      "entered_date" : getData[i].entered_at,
      "gender" : getData[i].gender === "male"　? "男性" : getData[i].gender === "female" ? "女性" : "",
      "birthday" : getData[i].birth_at,
      //"採用情報形態": 不明
      "mail" : getData[i].email,
      "tel" : getData[i].tel_number,
      "presentAddress_postalCode" : getData[i].address.zip_code,
      "presentAddress_prefectures" : getData[i].address.pref,
      "presentAddress_municipalities" : getData[i].address.city,
      "presentAddress_houseNumber" : getData[i].address.street,
      "presentAddress_roomNumber" : getData[i].address.building,
      "pressentAddress_countryCode" : getData[i].address.country_number,
      "pressentAddress_yomi" : getData[i].address.literal_yomi,
      "emergencyContact_relationship" : getData[i].emergency_relation_name,
      "emergencyContact_name" : getData[i].emergency_last_name + "　" + getData[i].emergency_first_name,
      "emergencyContact_name_kana" : getData[i].emergency_last_name_yomi + "　" + getData[i].emergency_first_name_yomi,
      "emergencyContact_tel" : getData[i].emergency_tel_number,
      "emergencyContact_postalCode" : getData[i].emergency_address ? getData[i].emergency_address.zip_code : null,
      "emergencyContact_prefectures" : getData[i].emergency_address ? getData[i].emergency_address.pref : null,
      "emergencyContact_municipalities" : getData[i].emergency_address ? getData[i].emergency_address.city : null,
      "emergencyContact_houseNumber" : getData[i].emergency_address ? getData[i].emergency_address.street : null,
      "emergencyContact_roomNumber" : getData[i].emergency_address ? getData[i].emergency_address.building : null,
      "residentAddress_countryCode" : getData[i].resident_card_address ? getData[i].resident_card_address.country_number : null,
      "residentAddress_postalCode": getData[i].resident_card_address ? getData[i].resident_card_address.zip_code : null,
      "residentAddress_prefectures": getData[i].resident_card_address ? getData[i].resident_card_address.pref : null,
      "residentAddress_municipalities": getData[i].resident_card_address ? getData[i].resident_card_address.city : null,
      "residentAddress_houseNumber": getData[i].resident_card_address ? getData[i].resident_card_address.street : null,
      "residentAddress_roomNumber": getData[i].resident_card_address ? getData[i].resident_card_address.building : null,
      "residentAddress_yomi" : getData[i].resident_card_address ? getData[i].resident_card_address.literal_yomi : null,
      "bankCode": getData[i].bank_accounts ? getData[i].bank_accounts[0].bank_code : null,
      "branchCode": getData[i].bank_accounts ? getData[i].bank_accounts[0].bank_branch_code : null,
      "depositType": getData[i].bank_accounts ? getData[i].bank_accounts[0].account_type : null,
      "accountNumber": getData[i].bank_accounts ? getData[i].bank_accounts[0].account_number : null,
      "accountName": getData[i].bank_accounts ? getData[i].bank_accounts[0].account_holder_name : null,
      
      // "schoolType1": getData[i].,
      // "schoolName1": ,
      // "dateOfAdmission1": ,
      // "dateOfLeaving1": ,
      // "graduationOrLeaving1": ,
      // "course1": ,
      // "majorSubjects1": ,
      // "versant_score": ,
      // "versant_date_of_examination": ,
      // "p360_score": ,
      // "p360_date_of_examination": ,
      // "testName": ,
      // "score": ,
      // "date_of_examination": ,
      // "otherForeignLanguages1": ,
      // "otherForeignLanguages_testName1": ,
      // "otherForeignLanguages_dateOfExamination1": ,
      // "license": ,
      // "license_date_of_examination": ,
      // "knowledge": ,
      // "knowledge_date_of_Examination": ,
      //家族情報を取得する必要あり↓
      "family_relationship1": familyDate[i][0] ? familyDate[i][0].relation_name : null,
      "family_lastName1": familyDate[i][0] ? familyDate[i][0].last_name : null,
      "family_firstName1": familyDate[i][0] ? familyDate[i][0].first_name : null,
      "family_lastName1_kana": familyDate[i][0] ? familyDate[i][0].last_name_yomi : null,
      "family_firstName1_kana": familyDate[i][0] ? familyDate[i][0].first_name_yomi : null,
      "family_birthday1": familyDate[i][0] ? familyDate[i][0].birth_at : null,
      "family_gender1": familyDate[i][0] ? familyDate[i][0].gender : null,
      "family_job1": familyDate[i][0] ? familyDate[i][0].job : null,
      "living_together1": familyDate[i][0] ? familyDate[i][0].live_together_type : null,
      "family_postalCode1" : familyDate[i][0] ? familyDate[i][0].address.zip_code : null,
      "family_prefectures1" : familyDate[i][0] ? familyDate[i][0].address.pref : null,
      "family_municipalities1" : familyDate[i][0] ? familyDate[i][0].address.city : null,
      "family_houseNumber1" : familyDate[i][0] ? familyDate[i][0].address.street : null,
      "family_roomNumber1" : familyDate[i][0] ? familyDate[i][0].address.building : null,
      "family_tel1": familyDate[i][0] ? familyDate[i][0].tel_number : null,
      "family_tax_law_support_type1": familyDate[i][0] ? familyDate[i][0].tax_law_support_type : null,
      "family_is_spouse1" : familyDate[i][0] ? familyDate[i][0].is_spouse : null,
      "family_handicapped_type1" : familyDate[i][0] ? familyDate[i][0].handicapped_type : null,
      "family_social_insurance_support_type1" : familyDate[i][0] ? familyDate[i][0].social_insurance_support_type : null,


      "family_relationship2": familyDate[i][1] ? familyDate[i][1].relation_name : null,
      "family_lastName2": familyDate[i][1] ? familyDate[i][1].last_name : null,
      "family_firstName2": familyDate[i][1] ? familyDate[i][1].first_name : null,
      "family_lastName2_kana": familyDate[i][1] ? familyDate[i][1].last_name_yomi : null,
      "family_firstName2_kana": familyDate[i][1] ? familyDate[i][1].first_name_yomi : null,
      "family_birthday2": familyDate[i][1] ? familyDate[i][1].birth_at : null,
      "family_gender2": familyDate[i][1] ? familyDate[i][1].gender : null,
      "family_job2": familyDate[i][1] ? familyDate[i][1].job : null,
      "living_together2": familyDate[i][1] ? familyDate[i][1].live_together_type : null,
      "family_postalCode2" : familyDate[i][1] ? familyDate[i][1].address.zip_code : null,
      "family_prefectures2" : familyDate[i][1] ? familyDate[i][1].address.pref : null,
      "family_municipalities2" : familyDate[i][1] ? familyDate[i][1].address.city : null,
      "family_houseNumber2" : familyDate[i][1] ? familyDate[i][1].address.street : null,
      "family_roomNumber2" : familyDate[i][1] ? familyDate[i][1].address.building : null,
      "family_tel2": familyDate[i][1] ? familyDate[i][1].tel_number : null
    }
  }

  return changedDate
}

/**
 * @param {string} status 0:基本情報 1:連絡先 2:住所 3:緊急連絡先 4:銀行口座 5:学歴 6:語学 7:免許・資格等 8:家族情報
 */
function api(list, status) {
  const token = commonFunction.getToken();

  let member_data = {
    "member_data" : list
  }

  //APIに必要な情報
  let apiOptions = {
    'headers' : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify(member_data),
    'method': 'patch',
    'muteHttpExceptions' : true
  }
  console.log(apiOptions)
  
  if(status === 0) {
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/members', apiOptions).getContentText())
    return json
  }else if(status === 1){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2081', apiOptions).getContentText())
    return json
  }else if(status === 2){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2078', apiOptions).getContentText())
    return json
  }else if(status === 3){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2080', apiOptions).getContentText())
    return json
  }else if(status === 4){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2082', apiOptions).getContentText())
    return json
  }else if(status === 5){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2083', apiOptions).getContentText())
    return json
  }else if(status === 6){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2084', apiOptions).getContentText())
    return json
  }else if(status === 7){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2085', apiOptions).getContentText())
    return json
  }else if(status === 8){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/2086', apiOptions).getContentText())
    return json
  }
}