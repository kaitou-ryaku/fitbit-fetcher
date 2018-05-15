function translate_unixtime_to_yyyymmdd(unixtime) {
  var year   = (new Date(1000*unixtime)).getFullYear();
  var month  = ("0" + ((new Date(1000*unixtime)).getMonth() + 1)).slice(-2);
  var day    = ("0" +  (new Date(1000*unixtime)).getDate()      ).slice(-2);
  var yyyymmdd = year+"-"+month+"-"+day;
  return yyyymmdd;
}

function isFileExists(filename) {
  var xhr = null;
  // 使える場合はMicrosoft.XMLHTTP, 使えない場合はXMLHttpRequest
  try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) { xhr = new XMLHttpRequest(); }

  xhr.open("GET", filename, false);
  try {
    xhr.send(null);
  return true;
  } catch(e) {
    return false;
  }
}

function common_layout(frame) {
  var bgn_yyyymmdd = translate_unixtime_to_yyyymmdd(frame["bgn_unixtime"]);
  var end_yyyymmdd = translate_unixtime_to_yyyymmdd(frame["end_unixtime"]+24*3600);
  var layout = {
    title      : "",
    autosize   : false,
    width      : Math.round(window.innerWidth*0.9),
    height     : 200,
    margin     : {l:50, r:0, b:20, t:15, pad:0},
    showlegend : false,
    hovermode  : "closest",
    xaxis: {
      autorange  : false,
      range      : [bgn_yyyymmdd, end_yyyymmdd],
      dtick      : 3600*1000,
      tickformat : "%H",
      autotick   : false,
      showgrid   : true,
      showline   : true,
      gridcolor  : "#C0C0C0",
      gridwidth  : 1,
    }
  };

  return layout;
}

