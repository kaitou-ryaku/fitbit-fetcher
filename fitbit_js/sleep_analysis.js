function create_xys_sleep(filename, content) {
  var xys = {};

  var day = filename.split("/")[3].split('_')[0].replace(/-/g,"/");
  var lines = content.split(/\r\n|\r|\n/);
  for (var i=0; i<lines.length; ++i) {
    var line = lines[i];
    var tmp_time = line.split(",")[0];
    var datetime = new Date(day + " " + tmp_time);
    var value    = line.split(",")[1];
    if (!(value in xys)) {
      var xy = {
        datetime_list : [],
        value_list    : []
      }
      xys[value] = xy;
    }
    xys[value]["datetime_list"].push(datetime);
    xys[value]["value_list"].push(15);
  }

  return xys;
}
