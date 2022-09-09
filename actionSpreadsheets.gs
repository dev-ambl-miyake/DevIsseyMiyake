  /**
   * @param {string} message  アラートメッセージに表示する文字列
   */
  // スプレッドシートにアラートメッセージを表示する
  function alert(message) {
    var ui = SpreadsheetApp.getUi();
    ui.alert(message);
  }
