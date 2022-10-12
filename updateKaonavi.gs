function kaonaviMain() {
  let folderId = "1_Yc3q1b8ClYNbOW-orwejJTrfSlczhI8";
  //ファイル名一覧
  let regular_business = "announcement.csv";//現職本務
  let sub_business = "現職兼務データ.csv";//現職兼務
  let regular_business_history = "本務経歴データ.csv";//本務経歴
  let sub_business_history = "発令履歴兼務データ.csv";//兼務履歴
  let travel_allowance = "通勤手当データ.csv";//通勤手当


  //ファイルが存在する場合のみ実行
  if(commonFunction.checkExistFile(folderId, regular_business) && commonFunction.checkExistFile(folderId, travel_allowance)) {
    let csv_regular_business = commonFunction.import_csv(operation_type = 3.1)//現職本務データ取得
    let csv_travel_allowance = commonFunction.import_csv(operation_type = 3.2)//通勤手当データ取得
    let csv_sub_business = commonFunction.import_csv(operation_type = 3.3)//現職兼務データ取得

    //csvにデータが存在する場合のみ実行
    if(csv_regular_business.length > 0){
      let kaonavi_data = changeDataToKaonavi(csv_regular_business, csv_travel_allowance);

      updateKaonavi(kaonavi_data);

    }
  }
}

function changeDataToKaonavi(csv_regular_business, csv_travel_allowance) {
  
  let kaonavi_data = [];

  try {

    for(let i = 0; i < csv_regular_business.length; i++) {

      let data = [
        ("00000" + csv_regular_business[i][0]).slice(-5),//職種　社員コード 5桁に変換
        csv_regular_business[i][16],//雇用形態　社員区分
        csv_regular_business[i][8],//職種
        csv_regular_business[i][2],//所属名階層あり
        csv_regular_business[i][12],//役職 
        csv_regular_business[i][6],//グレード
        csv_regular_business[i][10],//レベル
        csv_regular_business[i][19],//退職日
        csv_regular_business[i][14],//勤務地
        //採用地 現在obic資料にも存在しません
        //採用時職種　現在obic資料にも存在しません
        //配属開始日　発令日
        //配属終了日　最新の発令日の一日前
        //本務所属履歴
        //本務役職履歴
        //兼務所属履歴1
        //兼務役職履歴1
        //兼務所属履歴2
        //兼務役職履歴2
        //兼務所属履歴3
        //兼務役職履歴3
        //兼務所属履歴4
        //兼務役職履歴4
        //配属開始日
        //配属終了日
        //所属履歴
        //兼務所属履歴1
        //兼務所属履歴2
        //兼務所属履歴3
        //兼務所属履歴4
        //役職開始日
        //役職終了日
        //役職履歴
        //兼務役職履歴1
        //兼務役職履歴2
        //兼務役職履歴3
        //兼務役職履歴4
        //発令日
        //終了日
        //グレード履歴
        //レベル履歴
        //発令日
        //終了日
        //休職事由
        //発令名
        //給与計
        //G給
        //貢献調整給
        //役職給 
      ]

      for(let m = 0; m < csv_travel_allowance.length; m++) {
        //同じ社員番号のデータを取得
        if(csv_travel_allowance[m][1] === csv_regular_business[i][0]) {
          data.push(csv_travel_allowance[m][18])//交通機関1
          data.push(csv_travel_allowance[m][19])//(発)利用駅1
          data.push(csv_travel_allowance[m][20])//(経由)利用駅1
          data.push(csv_travel_allowance[m][21])//(着)利用駅1
          data.push(csv_travel_allowance[m][9])//定期券金額1
          data.push(csv_travel_allowance[m][22])//備考1
          //交通機関2
          //(発)利用駅2
          //(経由)利用駅2
          //(着)利用駅2
          //定期券金額2
          //備考2
          //交通機関3
          //(発)利用駅3
          //(経由)利用駅3
          //(着)利用駅3
          //定期券金額3
          //備考3
          //交通機関3
          //(発)利用駅4
          //(経由)利用駅4
          //(着)利用駅4
          //定期券金額4
          //備考4
        }
      }

      kaonavi_data.push(data);

    }
    return kaonavi_data

  } catch(e) {

  }
}

function updateKaonavi(kaonavi_data) {
  try{
    // 開始ログ
    commonFunction.log('更新カオナビ連携登録', 's');

    //基本情報
    let basicInfoList = [];
    //データを作成 
    for(let i = 0; i < kaonavi_data.length; i++) {
      
      //基本情報
      let inputDataBasicInfo = {
        "code" : kaonavi_data[i][0],//社員番号
        "department" : {
          "name" : kaonavi_data[i][3]//所属名
        },
        "retired_date" : kaonavi_data[i][6],//退職日
        "custom_fields" : [
          {
            "id": 5533,
            "values" : [
              kaonavi_data[i][1]//雇用形態
            ]
          },
          {
            "id": 5534,
            "values" : [
              kaonavi_data[i][2]//職種
            ]
          },
          {
            "id": 5532,
            "values" : [
              kaonavi_data[i][4]//役職
            ]
          },
          {
            "id": 5535,
            "values" : [
              kaonavi_data[i][8]//勤務地
            ]
          }
        ]
      }
      basicInfoList.push(inputDataBasicInfo)
    }
    //通勤手当
    let travelList = [];
    //データを作成 
    for(let i = 0; i < kaonavi_data.length; i++) {
      
      //基本情報
      let inputDatatravel = {
        "code" : kaonavi_data[i][0],//社員番号
        "records": [
          {
            "custom_fields" : [
              {
                "id": 5637,
                "values" : [
                  kaonavi_data[i][0]//社員番号
                ]
              },
              {
                "id": 5638,
                "values" : [
                  kaonavi_data[i][9]//交通機関1
                ]
              },
              {
                "id": 5639,
                "values" : [
                  kaonavi_data[i][10]//（発）利用駅
                ]
              },
              {
                "id": 5640,
                "values" : [
                  kaonavi_data[i][11]//（経由）利用駅1
                ]
              },
             {
                "id": 5641,
                "values" : [
                  kaonavi_data[i][12]//（着）利用駅1
               ]
              },
              {
                "id": 5642,
                "values" : [
                  kaonavi_data[i][13]//定期券金額1
               ]
              },
              {
                "id": 5643,
                "values" : [
                  kaonavi_data[i][14]//備考1
               ]
              }
            ]
          }
        ]
      }
      travelList.push(inputDatatravel)
    }  

    let json = api(basicInfoList, 0);
    let json1 = api(travelList, 2);
    
    //終了ログ
    commonFunction.log('更新カオナビ連携登録', 'e')
  }catch(e) {
    console.log("error")
  }
}

/**
 * @param {string} status 0:基本情報 1:現住所 2:通勤経路
 */
function api(list, status) {

  const sheetsid_adress = "2078";//現住所シートID
  const sheetsid_travel = "2088";//通勤経路

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
  
  if(status === 0) {
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/members', apiOptions).getContentText())
    return json
  }else if(status === 1){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/' + sheetsid_adress, apiOptions).getContentText())
    return json
  }else if(status === 2){
    //APIからの返答
    let json = JSON.parse(UrlFetchApp.fetch('https://api.kaonavi.jp/api/v2.0/sheets/' + sheetsid_travel, apiOptions).getContentText())
    return json
  }
}

//       //現住所シート
//       let inputPresentAddressData = {
//         "code" : changedDate[i].code,
//         "records" : [
//           {
//             "custom_fields" : [
//               {
//                 "id" : 5537,
//                 "values": [
//                   changedDate[i].presentAddress_postalCode
//                 ]
//               },
//               {
//                 "id" : 5538,
//                 "values": [
//                   changedDate[i].presentAddress_prefectures
//                 ]
//               },
//               {
//                 "id" : 5539,
//                 "values": [
//                   changedDate[i].presentAddress_municipalities
//                 ]
//               },
//               {
//                 "id" : 5540,
//                 "values": [
//                   changedDate[i].presentAddress_houseNumber
//                 ]
//               },
//               {
//                 "id" : 5541,
//                 "values": [
//                   changedDate[i].presentAddress_roomNumber
//                 ]
//               },
//               {
//                 "id" : 5542,
//                 "values": [
//                   changedDate[i].pressentAddress_countryCode
//                 ]
//               }
//             ]
//           }
//         ]
//       }