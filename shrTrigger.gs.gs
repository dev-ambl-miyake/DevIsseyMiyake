/**
 * SmartHR連携更新_メインファンクションを実行するトリガーを作成
 * 毎日12時、18時に実行する単発トリガーを作成
 * 
 */
function setShrTrigger() {
  log("発令_SmartHR連携更新_12時実行用_トリガー作成", "s");
  const firstTime = new Date();
  firstTime.setHours(12);
  firstTime.setMinutes(00);
  ScriptApp.newTrigger('proclamationShrMain').timeBased().at(firstTime).create();
  log("発令_SmartHR連携更新_12時実行用_トリガー作成", "e");

  log("発令_SmartHR連携更新_18時実行用_トリガー作成", "s");
  const secondTime = new Date();
  secondTime.setHours(18);
  secondTime.setMinutes(00);
  ScriptApp.newTrigger('proclamationShrMain').timeBased().at(secondTime).create();
  log("発令_SmartHR連携更新_18時実行用_トリガー作成", "e");
}

 
function deleteShrTrigger() {

  const triggers = ScriptApp.getProjectTriggers();
  for(const trigger of triggers){
    if(trigger.getHandlerFunction() == "proclamationShrMain"){
      ScriptApp.deleteTrigger(trigger);
    }
  }
}
