function create_xy_heart(filename, content) {
  var xy = {
    datetime_list : [],
    value_list    : []
  }

  var day = filename.split("/")[3].split('_')[0].replace(/-/g,"/")
  var lines = content.split("\n");
  for (var i = 0; i < lines.length;++i) {
    if (i%4 !== 0) continue;
    var line = lines[i];
    if (line.match(/[a-zA-Z]/i)) continue;
    var tmp_time = line.split(",")[0];
    var datetime = new Date(day + " " + tmp_time);
    xy["datetime_list"].push(datetime);

    var value = line.split(",")[1];
    xy["value_list"].push(value);
  }

  return xy;
}

function plot_heart_list(datetime_list, value_list, frame) {
  var element = document.getElementById(frame['frame_id']);

  var dataset = [{
    x    : datetime_list,
    y    : value_list,
    type : 'scatter',
    mode : 'lines',
    line : {
      color   : "#FF0000",
      opacity : 0.5,
      width   : 1
    }
  }];

  var layout = common_layout(frame);
  layout['yaxis'] = {
    range: [0, 160],
    autotick: false,
    dtick: 20
  };

  Plotly.plot(element, dataset, layout);
}
