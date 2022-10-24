function myFunction() {
const member_sheets_api = kaonaviMemberSheetsApi(); // カオナビの基本情報シート情報
const member_custom_list = member_sheets_api['custom_fields']; // カオナビの基本情報シートカスタム項目リスト

// 取得APIを取得
const employees_api = kaonaviMemberApi(); // カオナビの全従業員情報API
const member_list = employees_api['member_data']; // カオナビの全従業員情報リスト

const sheets_api = kaonaviSheetsApi(); // カオナビの全シート情報
const sheets_list = sheets_api['sheets']; // カオナビの全シート情報

// for (let i = 0; i < sheets_list.length; i++) {
//   if(sheets_list[i]['name'] == '通勤経路'){
//     traffic_list = sheets_list[i]['custom_fields'];
//   }
// }
log(JSON.stringify(employees_api, null, 5),'s');
}
