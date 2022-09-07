function getProperties(propertieName) {
  //プロパティを取得
  const scriptProperties = PropertiesService.getScriptProperties();
  const data = scriptProperties.getProperties();                     

  //keyが引数のプロパティの値を返す
  return data[propertieName];
}