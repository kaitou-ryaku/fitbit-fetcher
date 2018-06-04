function create_xy_lack(filename, content) {
  var xy = {
    datetime_list : [],
    value_list    : []
  }

  var day = filename.split("/")[3].split('_')[0].replace(/-/g,"/")
  var lines = content.split("\n");
  for (var i = 0; i < lines.length;++i) {
    var line = lines[i];
    var start = new Date(day + " " + line.split(",")[0]);
    var stop  = new Date(day + " " + line.split(",")[1]);

    for (var tmp = start; tmp < stop; tmp.setMinutes(tmp.getMinutes() + 1)) {
      var lack = new Date(tmp.getTime());
      xy["datetime_list"].push(lack);
      xy["value_list"].push("200");
    }
  }

  return xy;
}

function plot_lack_list(datetime_list, value_list, frame) {
  var element = document.getElementById(frame['frame_id']);

  var dataset = [{
    x      : datetime_list,
    y      : value_list,
    type   : 'bar',
    marker : {
      color   : "#000000",
      opacity : 1,
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
