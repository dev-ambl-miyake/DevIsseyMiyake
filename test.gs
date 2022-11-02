function myFunction() {
// 取得APIをグローバル変数で管理
//何ページ分取得するか（登録されている社員数に依存する）
var LAST_PAGE = 2;
//1ページ最大100件まで
var PER_PAGE = 100;

// SmartHRのアクセストークンとサブドメインの宣言
const ACCESS_TOKEN = getProperties("ACCESS_TOKEN");
const SUB_DOMAIN = getProperties("SUB_DOMAIN");

// 雇用形態のリストをAPIで取得
var dep_response = 
"https://"+SUB_DOMAIN+".daruma.space/api/v1/departments?page="+"1"+"&per_page="+"100"+"&access_token="+ACCESS_TOKEN;
var dep_responseBody = UrlFetchApp.fetch(dep_response).getContentText();
// 雇用形態のJsonリスト
var dep_json = JSON.parse(dep_responseBody);
console.log(dep_json);  
  // Logger.log(newArray);
// const member_sheets_api = kaonaviMemberSheetsApi(); // カオナビの基本情報シート情報
// const member_custom_list = member_sheets_api['custom_fields']; // カオナビの基本情報シートカスタム項目リスト

// console.log(member_sheets_api);

// const department_api = kaonaviDepartmentApi(); // カオナビの所属ツリーAPI
// var department_list = department_api['department_data'];

// log(JSON.stringify(department_list),'s');

// var str1 = '(総)品質管理';
// var str2 = '(販)販売';
// var str3 = '(専)技術';

// str2 = str2.substring(0, 3);
// console.log(str2);

// for (let i = 0; i < department_list.length; i++) {
//   if(department_list[i]['name'] == 'IM 新宿伊勢丹'){
//     console.log('IM 新宿伊勢丹');
//   }
// }



// 取得APIを取得
// const employees_api = kaonaviMemberApi(); // カオナビの全従業員情報API
// const member_list = employees_api['member_data']; // カオナビの全従業員情報リスト

// const sheets_api = kaonaviSheetsApi(); // カオナビの全シート情報
// const sheets_list = sheets_api['sheets']; // カオナビの全シート情報

// for (let i = 0; i < sheets_list.length; i++) {
//   if(sheets_list[i]['name'] == '通勤経路'){
//     traffic_list = sheets_list[i]['custom_fields'];
//   }
// }
// log(JSON.stringify(department_api, null, 5),'s');
}



/**
 * カオナビメンバーのシート情報更新
 * @param {string} sheet_id シートID
 * @param {jsonstring} member_data 連想配列をjson文字列に変換した値
 */
function kaonaviDepartmentUpdateApi() {

  const token = getToken();
  var apiUrl = 'https://api.kaonavi.jp/api/v2.0/departments';
  

  var payload = {
     "department_data": [
          {
               "code": "998",
               "name": "（削除予定）退職者",
               "parent_code": null,
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "01",
               "name": "役員",
               "parent_code": null,
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "90",
               "name": "企画技術",
               "parent_code": null,
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "91",
               "name": "企画",
               "parent_code": null,
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "02",
               "name": "国内・海外ビジネス",
               "parent_code": null,
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0201",
               "name": "IM",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0201001",
               "name": "IM 企画",
               "parent_code": "0201",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0201002",
               "name": "IM 技術",
               "parent_code": "0201",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0201010",
               "name": "IM 生産",
               "parent_code": "0201",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0201030",
               "name": "IM 営業",
               "parent_code": "0201",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0201021",
               "name": "IM 営業 商品計画",
               "parent_code": "0201030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0201031",
               "name": "IM 営業 国内営業",
               "parent_code": "0201030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0201041",
               "name": "IM 営業 海外営業",
               "parent_code": "0201030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0201051",
               "name": "IM 営業 販売促進",
               "parent_code": "0201030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0215",
               "name": "LA",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0215010",
               "name": "LA 生産",
               "parent_code": "0215",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0215030",
               "name": "LA 営業",
               "parent_code": "0215",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0215021",
               "name": "LA 営業 商品計画",
               "parent_code": "0215030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0215031",
               "name": "LA 営業 国内営業",
               "parent_code": "0215030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0203",
               "name": "IL",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0203001",
               "name": "IL 企画",
               "parent_code": "0203",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0203002",
               "name": "IL 技術",
               "parent_code": "0203",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0203010",
               "name": "IL 生産",
               "parent_code": "0203",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0203030",
               "name": "IL 営業",
               "parent_code": "0203",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0203021",
               "name": "IL 営業 商品計画",
               "parent_code": "0203030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0203031",
               "name": "IL 営業 国内営業",
               "parent_code": "0203030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0203041",
               "name": "IL 営業 海外営業",
               "parent_code": "0203030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0203051",
               "name": "IL 営業 販売促進",
               "parent_code": "0203030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0205",
               "name": "PL",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0205001",
               "name": "PL 企画",
               "parent_code": "0205",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0205002",
               "name": "PL 技術",
               "parent_code": "0205",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0205010",
               "name": "PL 生産",
               "parent_code": "0205",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0205030",
               "name": "PL 営業",
               "parent_code": "0205",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0205021",
               "name": "PL 営業 商品計画",
               "parent_code": "0205030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0205031",
               "name": "PL 営業 国内営業",
               "parent_code": "0205030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0205041",
               "name": "PL 営業 海外営業",
               "parent_code": "0205030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0205051",
               "name": "PL 営業 販売促進",
               "parent_code": "0205030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0204",
               "name": "HP",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0204001",
               "name": "HP 企画",
               "parent_code": "0204",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0204002",
               "name": "HP 技術",
               "parent_code": "0204",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0204010",
               "name": "HP 生産",
               "parent_code": "0204",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0204030",
               "name": "HP 営業",
               "parent_code": "0204",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0204021",
               "name": "HP 営業 商品計画",
               "parent_code": "0204030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0204031",
               "name": "HP 営業 国内営業",
               "parent_code": "0204030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0204041",
               "name": "HP 営業 海外営業",
               "parent_code": "0204030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0204051",
               "name": "HP 営業 販売促進",
               "parent_code": "0204030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0214",
               "name": "AT",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0214001",
               "name": "AT 企画",
               "parent_code": "0214",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0214002",
               "name": "AT 技術",
               "parent_code": "0214",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0214010",
               "name": "AT 生産",
               "parent_code": "0214",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0214030",
               "name": "AT 営業",
               "parent_code": "0214",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0214021",
               "name": "AT 営業 商品計画",
               "parent_code": "0214030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0214031",
               "name": "AT 営業 国内営業",
               "parent_code": "0214030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0214041",
               "name": "AT 営業 海外営業",
               "parent_code": "0214030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0214051",
               "name": "AT 営業 販売促進",
               "parent_code": "0214030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0206",
               "name": "MI",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0206001",
               "name": "MI 企画",
               "parent_code": "0206",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0206002",
               "name": "MI 技術",
               "parent_code": "0206",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0206010",
               "name": "MI 生産",
               "parent_code": "0206",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0206030",
               "name": "MI 営業",
               "parent_code": "0206",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0206021",
               "name": "MI 営業 商品計画",
               "parent_code": "0206030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0206031",
               "name": "MI 営業 国内営業",
               "parent_code": "0206030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0206041",
               "name": "MI 営業 海外営業",
               "parent_code": "0206030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0206051",
               "name": "MI 営業 販売促進",
               "parent_code": "0206030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0207",
               "name": "HA",
               "parent_code": "0278",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0207001",
               "name": "HA 企画",
               "parent_code": "0207",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0207002",
               "name": "HA 技術",
               "parent_code": "0207",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0207010",
               "name": "HA 生産",
               "parent_code": "0207",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0207030",
               "name": "HA 営業",
               "parent_code": "0207",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0207021",
               "name": "HA 営業 商品計画",
               "parent_code": "0207030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0207031",
               "name": "HA 営業 国内営業",
               "parent_code": "0207030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0207041",
               "name": "HA 営業 海外営業",
               "parent_code": "0207030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0207051",
               "name": "HA 営業 販売促進",
               "parent_code": "0207030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0233",
               "name": "ストア推進室",
               "parent_code": "02",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "07",
               "name": "社長管轄",
               "parent_code": null,
               "leader_member_code": null,
               "order": 12,
               "memo": null
          },
          {
               "code": "03",
               "name": "経営企画",
               "parent_code": null,
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "09",
               "name": "管理・財務",
               "parent_code": null,
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0972",
               "name": "経営管理室",
               "parent_code": "09",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0967",
               "name": "総務部",
               "parent_code": "09",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0967063",
               "name": "総務部 総務",
               "parent_code": "0967",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0967060",
               "name": "総務部 資料室",
               "parent_code": "0967",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0967064",
               "name": "総務部 情報システム",
               "parent_code": "0967",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0970",
               "name": "人事部",
               "parent_code": "09",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0970101",
               "name": "人事部付",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0970102",
               "name": "人事部付（MDS出向）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0970103",
               "name": "人事部付（A-net出向）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0970104",
               "name": "人事部付（A-con出向）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0970105",
               "name": "人事部付（IMU出向）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0970106",
               "name": "人事部付（研修）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0970107",
               "name": "人事部付（休職）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0970108",
               "name": "※不使用　人事部付（販売・休職）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0971",
               "name": "販売部",
               "parent_code": "09",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0971081",
               "name": "販売部 東日本",
               "parent_code": "0971",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0971083",
               "name": "販売部 西日本",
               "parent_code": "0971",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0971070",
               "name": "カスタマーサービス室",
               "parent_code": "0971",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "05",
               "name": "生産・製造技術開発",
               "parent_code": null,
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0534",
               "name": "生産統括部",
               "parent_code": "05",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0534011",
               "name": "プリーツ工房",
               "parent_code": "0534",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0534012",
               "name": "プリーツ工房 エンジニア",
               "parent_code": "0534011",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0534013",
               "name": "プリーツ工房 縫製",
               "parent_code": "0534011",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0534014",
               "name": "CAD室",
               "parent_code": "0534",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0535",
               "name": "品質管理室",
               "parent_code": "05",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0535015",
               "name": "品質管理室 修理",
               "parent_code": "0535",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "10",
               "name": "コミュニケーションデザイン",
               "parent_code": null,
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "1036",
               "name": "デジタル推進室",
               "parent_code": "10",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1038",
               "name": "制作推進室",
               "parent_code": "10",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "1038055",
               "name": "制作推進室 制作管理担当",
               "parent_code": "1038",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1038056",
               "name": "制作推進室 コンテンツ制作担当",
               "parent_code": "1038",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "1039",
               "name": "EC推進室",
               "parent_code": "10",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "08",
               "name": "ショップ",
               "parent_code": null,
               "leader_member_code": null,
               "order": 13,
               "memo": null
          },
          {
               "code": "0871",
               "name": "販売部",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0871108",
               "name": "人事部付（販売・休職）",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0871109",
               "name": "人事部付（販売）",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0871308",
               "name": "船場",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0871085",
               "name": "販売部 オフィス",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0871309",
               "name": "神戸",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0871302",
               "name": "RLIM",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0871306",
               "name": "丸の内",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0871331",
               "name": "札幌三越",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "0871307",
               "name": "京都",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0871317",
               "name": "渋谷パルコ",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0871357",
               "name": "GINZA",
               "parent_code": "0871",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0801",
               "name": "IM（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0801301",
               "name": "IM 青山",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0801341",
               "name": "（廃）IM 渋谷西武",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0801342",
               "name": "（廃）IM 池袋西武",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0801322",
               "name": "IM 新宿伊勢丹",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0801325",
               "name": "IM 銀座松屋",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0801326",
               "name": "IM 日本橋髙島屋",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "0801333",
               "name": "IM 日本橋三越",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0801346",
               "name": "（廃）IM 横浜そごう",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 17,
               "memo": null
          },
          {
               "code": "0801328",
               "name": "IM 名古屋髙島屋",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 12,
               "memo": null
          },
          {
               "code": "0801324",
               "name": "IM 京都伊勢丹",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 15,
               "memo": null
          },
          {
               "code": "0801349",
               "name": "IM 梅田阪急",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 13,
               "memo": null
          },
          {
               "code": "0801354",
               "name": "IM 福岡岩田屋",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 16,
               "memo": null
          },
          {
               "code": "0801308",
               "name": "IM 船場",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0801309",
               "name": "IM 神戸",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0801335",
               "name": "（廃）IM 広島三越",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 18,
               "memo": null
          },
          {
               "code": "0801336",
               "name": "IM 札幌大丸",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0801330",
               "name": "IM 大阪髙島屋",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 14,
               "memo": null
          },
          {
               "code": "0801357",
               "name": "IM GINZA",
               "parent_code": "0801",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0810",
               "name": "IP（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0810301",
               "name": "IP 青山",
               "parent_code": "0810",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0815",
               "name": "LA（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0815301",
               "name": "LA 青山",
               "parent_code": "0815",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0815308",
               "name": "LA 船場",
               "parent_code": "0815",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0815317",
               "name": "LA 渋谷パルコ",
               "parent_code": "0815",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0815357",
               "name": "LA GINZA",
               "parent_code": "0815",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0803",
               "name": "IL（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0803308",
               "name": "IL 船場",
               "parent_code": "0803",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0803309",
               "name": "IL 神戸",
               "parent_code": "0803",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0803302",
               "name": "IL RLIM",
               "parent_code": "0803",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0803306",
               "name": "IL 丸の内",
               "parent_code": "0803",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0803357",
               "name": "IL GINZA",
               "parent_code": "0803",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0805",
               "name": "PL（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0805301",
               "name": "PL 青山",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0805342",
               "name": "（廃）PL 池袋西武",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "0805343",
               "name": "PL 池袋東武",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 12,
               "memo": null
          },
          {
               "code": "0805325",
               "name": "PL 銀座松屋",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0805333",
               "name": "PL 日本橋三越",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 13,
               "memo": null
          },
          {
               "code": "0805310",
               "name": "PL 六本木",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0805344",
               "name": "PL 新宿京王",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 16,
               "memo": null
          },
          {
               "code": "0805346",
               "name": "（廃）PL 横浜そごう",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 17,
               "memo": null
          },
          {
               "code": "0805331",
               "name": "PL 札幌三越",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0805336",
               "name": "PL 札幌大丸",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0805328",
               "name": "PL 名古屋髙島屋",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 18,
               "memo": null
          },
          {
               "code": "0805351",
               "name": "PL 梅田阪神",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 21,
               "memo": null
          },
          {
               "code": "0805339",
               "name": "PL 心斎橋大丸",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 20,
               "memo": null
          },
          {
               "code": "0805354",
               "name": "PL 福岡岩田屋",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 28,
               "memo": null
          },
          {
               "code": "0805308",
               "name": "PL 船場",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0805322",
               "name": "PL 新宿伊勢丹",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0805324",
               "name": "PL 京都伊勢丹",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 25,
               "memo": null
          },
          {
               "code": "0805350",
               "name": "PL 博多阪急",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 27,
               "memo": null
          },
          {
               "code": "0805337",
               "name": "PL 東京大丸",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 15,
               "memo": null
          },
          {
               "code": "0805353",
               "name": "PL 阿倍野ハルカス",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 24,
               "memo": null
          },
          {
               "code": "0805349",
               "name": "PL 梅田阪急",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 22,
               "memo": null
          },
          {
               "code": "0805330",
               "name": "PL 大阪髙島屋",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 23,
               "memo": null
          },
          {
               "code": "0805329",
               "name": "PL 京都髙島屋",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 26,
               "memo": null
          },
          {
               "code": "0805334",
               "name": "PL 名古屋三越",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 19,
               "memo": null
          },
          {
               "code": "0805332",
               "name": "PL 仙台三越",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0805326",
               "name": "PL 日本橋髙島屋",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 14,
               "memo": null
          },
          {
               "code": "0805309",
               "name": "PL 神戸",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0805357",
               "name": "PL GINZA",
               "parent_code": "0805",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0804",
               "name": "HP（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0804308",
               "name": "HP 船場",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0804306",
               "name": "HP 丸の内",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0804347",
               "name": "HP 阪急MEN'S TOKYO",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0804303",
               "name": "HP 代官山",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0804350",
               "name": "HP 博多阪急",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 13,
               "memo": null
          },
          {
               "code": "0804330",
               "name": "HP 大阪髙島屋",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "0804301",
               "name": "HP 青山",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0804317",
               "name": "HP 渋谷パルコ",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0804357",
               "name": "HP GINZA",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0804307",
               "name": "HP 京都",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0804309",
               "name": "HP 神戸",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0804358",
               "name": "HP 新宿伊勢丹メンズ",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0814",
               "name": "AT（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0814301",
               "name": "AT 青山",
               "parent_code": "0814",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0814308",
               "name": "AT 船場",
               "parent_code": "0814",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0814306",
               "name": "AT 丸の内",
               "parent_code": "0814",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0814307",
               "name": "AT 京都",
               "parent_code": "0814",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0808",
               "name": "BB（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0808325",
               "name": "BB 銀座松屋",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0808308",
               "name": "BB 船場",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0808349",
               "name": "BB 梅田阪急",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 16,
               "memo": null
          },
          {
               "code": "0808328",
               "name": "BB 名古屋髙島屋",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 15,
               "memo": null
          },
          {
               "code": "0808315",
               "name": "BB 札幌パルコ",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0808327",
               "name": "BB 新宿髙島屋",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "0808330",
               "name": "（廃）BB 大阪髙島屋",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 23,
               "memo": null
          },
          {
               "code": "0808350",
               "name": "BB 博多阪急",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 21,
               "memo": null
          },
          {
               "code": "0808311",
               "name": "BB キッテ",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0808353",
               "name": "BB 阿倍野ハルカス",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 18,
               "memo": null
          },
          {
               "code": "0808354",
               "name": "BB 福岡岩田屋",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 22,
               "memo": null
          },
          {
               "code": "0808302",
               "name": "BB RLIM",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0808306",
               "name": "BB 丸の内",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0808348",
               "name": "BB 阪急MEN'S OSAKA",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 17,
               "memo": null
          },
          {
               "code": "0808316",
               "name": "BB 仙台パルコ2",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0808309",
               "name": "BB 神戸",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 19,
               "memo": null
          },
          {
               "code": "0808307",
               "name": "BB 京都",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0808347",
               "name": "BB 阪急MEN'S TOKYO",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 12,
               "memo": null
          },
          {
               "code": "0808322",
               "name": "BB 新宿伊勢丹",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 13,
               "memo": null
          },
          {
               "code": "0808317",
               "name": "BB 渋谷パルコ",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0808356",
               "name": "BB 心斎橋パルコ",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 20,
               "memo": null
          },
          {
               "code": "0808357",
               "name": "BB GINZA",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0808358",
               "name": "BB 新宿伊勢丹メンズ",
               "parent_code": "0808",
               "leader_member_code": null,
               "order": 14,
               "memo": null
          },
          {
               "code": "0806",
               "name": "MI（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0806301",
               "name": "MI 青山",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "0806343",
               "name": "MI 池袋東武",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 8,
               "memo": null
          },
          {
               "code": "0806325",
               "name": "MI 銀座松屋",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0806333",
               "name": "MI 日本橋三越",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 9,
               "memo": null
          },
          {
               "code": "0806344",
               "name": "MI 新宿京王",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 13,
               "memo": null
          },
          {
               "code": "0806346",
               "name": "（廃）MI 横浜そごう",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 22,
               "memo": null
          },
          {
               "code": "0806331",
               "name": "MI 札幌三越",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0806336",
               "name": "MI 札幌大丸",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0806354",
               "name": "MI 福岡岩田屋",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 21,
               "memo": null
          },
          {
               "code": "0806308",
               "name": "MI 船場",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0806329",
               "name": "MI 京都髙島屋",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 19,
               "memo": null
          },
          {
               "code": "0806327",
               "name": "MI 新宿髙島屋",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 12,
               "memo": null
          },
          {
               "code": "0806330",
               "name": "MI 大阪髙島屋",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 17,
               "memo": null
          },
          {
               "code": "0806350",
               "name": "MI 博多阪急",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 20,
               "memo": null
          },
          {
               "code": "0806349",
               "name": "MI 梅田阪急",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 16,
               "memo": null
          },
          {
               "code": "0806320",
               "name": "（廃）MI パルコヤ上野",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 23,
               "memo": null
          },
          {
               "code": "0806334",
               "name": "MI 名古屋三越",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 15,
               "memo": null
          },
          {
               "code": "0806332",
               "name": "MI 仙台三越",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0806326",
               "name": "MI 日本橋髙島屋",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 10,
               "memo": null
          },
          {
               "code": "0806337",
               "name": "MI 東京大丸",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "0806313",
               "name": "MI 渋谷ヒカリエ",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 14,
               "memo": null
          },
          {
               "code": "0806324",
               "name": "MI 京都伊勢丹",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 18,
               "memo": null
          },
          {
               "code": "0806357",
               "name": "MI GINZA",
               "parent_code": "0806",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0807",
               "name": "HA（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 11,
               "memo": null
          },
          {
               "code": "0807301",
               "name": "HA 青山",
               "parent_code": "0807",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0809",
               "name": "GG（ショップ）",
               "parent_code": "08",
               "leader_member_code": null,
               "order": 12,
               "memo": null
          },
          {
               "code": "0809303",
               "name": "GG 代官山",
               "parent_code": "0809",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0967065",
               "name": "総務部 施設管理",
               "parent_code": "0967",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0804348",
               "name": "HP 阪急MEN'S OSAKA",
               "parent_code": "0804",
               "leader_member_code": null,
               "order": 12,
               "memo": null
          },
          {
               "code": "0534016",
               "name": "生産担当",
               "parent_code": "0534",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0970110",
               "name": "人事部付（IML出向）",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "92",
               "name": "技術",
               "parent_code": null,
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0242",
               "name": "海外業務部",
               "parent_code": "02",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0241",
               "name": "海外営業部",
               "parent_code": "02",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0241042",
               "name": "海外営業部 ブランド営業",
               "parent_code": "0241",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0241043",
               "name": "海外営業部 アジア営業",
               "parent_code": "0241",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0277",
               "name": "渉外担当室",
               "parent_code": "02",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "13",
               "name": "プロダクト開発",
               "parent_code": null,
               "leader_member_code": null,
               "order": 7,
               "memo": null
          },
          {
               "code": "1308",
               "name": "BB",
               "parent_code": "13",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1308001",
               "name": "BB 企画",
               "parent_code": "1308",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1308002",
               "name": "BB 技術",
               "parent_code": "1308",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "1308010",
               "name": "BB 生産",
               "parent_code": "1308",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "1308030",
               "name": "BB 営業",
               "parent_code": "1308",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "1308021",
               "name": "BB 営業 商品計画",
               "parent_code": "1308030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1308031",
               "name": "BB 営業 国内営業",
               "parent_code": "1308030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "1308041",
               "name": "BB 営業 海外営業",
               "parent_code": "1308030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "1308051",
               "name": "BB 営業 販売促進",
               "parent_code": "1308030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "1309",
               "name": "GG",
               "parent_code": "13",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "1309001",
               "name": "GG 企画",
               "parent_code": "1309",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1309002",
               "name": "GG 技術",
               "parent_code": "1309",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "1309010",
               "name": "GG 生産",
               "parent_code": "1309",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "1309030",
               "name": "GG 営業",
               "parent_code": "1309",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "1309021",
               "name": "GG 営業 商品計画",
               "parent_code": "1309030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1309031",
               "name": "GG 営業 国内営業",
               "parent_code": "1309030",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "1309041",
               "name": "GG 営業 海外営業",
               "parent_code": "1309030",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "1309051",
               "name": "GG 営業 販売促進",
               "parent_code": "1309030",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "1319",
               "name": "IP・IW・IE",
               "parent_code": "13",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "1319030",
               "name": "IP・IW・IE 営業 営業",
               "parent_code": "1319",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "1319051",
               "name": "IP・IW・IE 営業 国内営業",
               "parent_code": "1319030",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0967066",
               "name": "総務部 法務",
               "parent_code": "0967",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0974",
               "name": "財務部",
               "parent_code": "09",
               "leader_member_code": null,
               "order": 5,
               "memo": null
          },
          {
               "code": "0974068",
               "name": "財務部 経理",
               "parent_code": "0974",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0974069",
               "name": "財務部 経営管理",
               "parent_code": "0974",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0579",
               "name": "生産統括",
               "parent_code": "05",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0575",
               "name": "製造技術開発室",
               "parent_code": "05",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "1061",
               "name": "広報室",
               "parent_code": "10",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0278",
               "name": "営業統括",
               "parent_code": "02",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0576017",
               "name": "生産統括部 業務推進",
               "parent_code": "0534",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          },
          {
               "code": "0576018",
               "name": "生産統括部 管理担当",
               "parent_code": "0534",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0803354",
               "name": "IL 福岡岩田屋",
               "parent_code": "0803",
               "leader_member_code": null,
               "order": 6,
               "memo": null
          },
          {
               "code": "0974067",
               "name": "（廃）財務部 経営企画",
               "parent_code": "0974",
               "leader_member_code": null,
               "order": 3,
               "memo": null
          },
          {
               "code": "0201019",
               "name": "IM DP制作",
               "parent_code": "0201",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0215019",
               "name": "LA DP制作",
               "parent_code": "0215",
               "leader_member_code": null,
               "order": 2,
               "memo": null
          },
          {
               "code": "0203019",
               "name": "IL DP制作",
               "parent_code": "0203",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0205019",
               "name": "PL DP制作",
               "parent_code": "0205",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0204019",
               "name": "HP DP制作",
               "parent_code": "0204",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0214019",
               "name": "AT DP制作",
               "parent_code": "0214",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0206019",
               "name": "MI DP制作",
               "parent_code": "0206",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0207019",
               "name": "HA DP制作",
               "parent_code": "0207",
               "leader_member_code": null,
               "order": 4,
               "memo": null
          },
          {
               "code": "0970075",
               "name": "人事部 キャリア開発",
               "parent_code": "0970",
               "leader_member_code": null,
               "order": 1,
               "memo": null
          }
     ]
  };
  

  payload = JSON.stringify(payload);
  // payload = JSON.parse(payload);

  console.log(payload);

  //APIに必要な情報(全従業員情報取得)
  var apiOptions = {
    headers : {
      'Kaonavi-Token' : token["access_token"],
      'Content-Type': 'application/json'
    },
    payload: payload,
    method: 'put', // 一括更新
    muteHttpExceptions : true,
  };

  //APIからの返答
  let response = UrlFetchApp.fetch(apiUrl, apiOptions).getContentText();
  console.log('response = '+ response, 'e'); // レスポンスをログに出力
  log('response = '+ response, 'e'); // レスポンスをログに出力
}
