function myFunction() {
  // let regex = /[。、・]/;
  let regex = /[。、・]/;
  var text = '京王線、小田急線。京王井の頭線・JR中央線';
  var text2 = '京王線・小田急線、京王井の頭線・JR中央線';
  var traffic_array = text2.split(regex);
  console.log(traffic_array);
}
