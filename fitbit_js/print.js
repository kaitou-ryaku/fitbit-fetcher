function plot_daily_graph_all(frame) {
  var bgnday = frame['bgn_unixtime'];
  var endday = frame['end_unixtime'];
  var day_term = Math.round((endday - bgnday) / (24*3600));
  var tmpday = endday;
  for (var i=0; i<=day_term; i++) {
    var yyyymmdd = translate_unixtime_to_yyyymmdd(tmpday);

    plot_daily_graph_single("lack/" +yyyymmdd+"_lack.csv" , frame);
    plot_daily_graph_single("heart/"+yyyymmdd+"_heart.csv", frame);
    plot_daily_graph_single("steps/"+yyyymmdd+"_steps.csv", frame);
    plot_daily_graph_single("sleep/"+yyyymmdd+"_sleep.csv", frame);
    //plot_daily_graph_single("minutesSedentary/"+yyyymmdd+"_minutesSedentary.csv", frame);
    plot_daily_graph_single("minutesFairlyActive/"+yyyymmdd+"_minutesFairlyActive.csv", frame);
    plot_daily_graph_single("minutesLightlyActive/"+yyyymmdd+"_minutesLightlyActive.csv", frame);
    plot_daily_graph_single("minutesVeryActive/"+yyyymmdd+"_minutesVeryActive.csv", frame);

    tmpday = tmpday - 24*3600;
  }
}

function plot_daily_graph_single(csvname, frame) {
  var weekly  = "fitbit/csv_data_weekly/";
  var daily   = "fitbit/csv_data/";

  var filename = null;
  if      (isFileExists(weekly + csvname)) filename = weekly + csvname;
  else if (isFileExists(daily  + csvname)) filename = daily  + csvname;
  else return;

  var xhr = null;
  // 使える場合はMicrosoft.XMLHTTP, 使えない場合はXMLHttpRequest
  try { xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) { xhr = new XMLHttpRequest(); }

  xhr.open("GET", filename, true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {

      if        (csvname.match(/steps/)) {
        var xy = create_xy_steps(filename, xhr.responseText);
        plot_steps_list(xy["datetime_list"], xy["value_list"], frame);

      } else if (csvname.match(/heart/)) {
        var xy = create_xy_heart(filename, xhr.responseText);
        plot_heart_list(xy["datetime_list"], xy["value_list"], frame);

      } else if (csvname.match(/sleep/)) {
        var xys = create_xys_sleep(filename, xhr.responseText);
        for (var key in xys) {
          var x = xys[key]["datetime_list"];
          var y = xys[key]["value_list"];
          if (key.match(/^wake/    )) plot_state_list(x, y, "#FF0080", frame);
          if (key.match(/^rem/     )) plot_state_list(x, y, "#B0B0FF", frame);
          if (key.match(/^light/   )) plot_state_list(x, y, "#4040FF", frame);
          if (key.match(/^deep/    )) plot_state_list(x, y, "#000080", frame);
          if (key.match(/^awake/   )) plot_state_list(x, y, "#FF0080", frame);
          if (key.match(/^restless/)) plot_state_list(x, y, "#4040FF", frame);
          if (key.match(/^asleep/  )) plot_state_list(x, y, "#000080", frame);
        }
      } else if (csvname.match(/minutesSedentary/)) {
        var xy = create_xy_activity(filename, xhr.responseText);
        plot_state_list(xy["datetime_list"], xy["value_list"], "#3000B0", frame);

      } else if (csvname.match(/minutesLightlyActive/)) {
        var xy = create_xy_activity(filename, xhr.responseText);
        plot_state_list(xy["datetime_list"], xy["value_list"], "#700070", frame);

      } else if (csvname.match(/minutesFairlyActive/)) {
        var xy = create_xy_activity(filename, xhr.responseText);
        plot_state_list(xy["datetime_list"], xy["value_list"], "#B00030", frame);

      } else if (csvname.match(/minutesVeryActive/)) {
        var xy = create_xy_activity(filename, xhr.responseText);
        plot_state_list(xy["datetime_list"], xy["value_list"], "#F00000", frame);

      } else if (csvname.match(/lack/)) {
        var xy = create_xy_lack(filename, xhr.responseText);
        plot_lack_list(xy["datetime_list"], xy["value_list"], frame);

      }
    }
  }
  xhr.send();
}
