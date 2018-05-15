function create_xys_sleep(filename, content) {
  var xys = [];
  for (var i=0; i<4; i++) {
    var xy = {
      datetime_list : [],
      value_list    : []
    }
    xys.push(xy);
  }

  var day = filename.split("/")[3].split('_')[0].replace(/-/g,"/");
  var lines = content.split("\n");
  for (var i=0; i<lines.length; ++i) {
    var line = lines[i];
    if (line.match(/[a-zA-Z]/i)) continue;
    var tmp_time = line.split(",")[1];
    var datetime = new Date(day + " " + tmp_time);
    var value = Number(line.split(",")[2]);
    if (value >= 0 && value < 4) {
      xys[value]["datetime_list"].push(datetime);
      xys[value]["value_list"].push(value*5);
    }
  }

  return xys;
}

function create_xy_activity(filename, content) {
  var xy = {
    datetime_list : [],
    value_list    : []
  }

  var day = filename.split("/")[3].split('_')[0].replace(/-/g,"/")
  var lines = content.split("\n");
  for (var i = 0; i < lines.length;++i) {
    var line = lines[i];
    if (line.match(/[a-zA-Z]/i)) continue;
    var value = Number(line.split(",")[1]);

    if (value === 1) {
      var tmp_time = line.split(",")[0];
      var datetime = new Date(day + " " + tmp_time);
      xy["datetime_list"].push(datetime);
      xy["value_list"].push(10);
    }
  }

  return xy;
}

function plot_state_list(datetime_list, value_list, rgb, frame) {
  var element = document.getElementById(frame['frame_id']);

  var dataset = [{
    x      : datetime_list,
    y      : value_list,
    type   : 'bar',
    mode   : 'markers',
    marker : {
      color : rgb
    }
  }];

  var layout = common_layout(frame);
  layout['yaxis'] = {
    range: [0, 3],
    autotick: false,
    tickwidth: 1
  };

  Plotly.plot(element, dataset, layout);
}
