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
