// デフォルトで1週間分表示
add_all_element(
  translate_unixtime_to_yyyymmdd((new Date().setHours(0,0,0,0)/1000) - 2*24*3600),
  translate_unixtime_to_yyyymmdd((new Date().setHours(0,0,0,0)/1000))
);

// 表示追加機能
document.getElementById("button").addEventListener("click", function(e) {
  e.preventDefault();

  var bgn_date = document.getElementById("bgn_date").value;
  var end_date = document.getElementById("end_date").value;

  add_all_element(bgn_date, end_date);
});

function add_all_element(bgn_date, end_date) {
  var bgn_day_unixtime = Math.round(new Date(bgn_date) / 1000);
  var end_day_unixtime = Math.round(new Date(end_date) / 1000);
  var term = (end_day_unixtime - bgn_day_unixtime) / (24*3600);

  for (var i=0; i<term; i++) {
    var day = end_day_unixtime - i*24*3600;
    var yyyymmdd = translate_unixtime_to_yyyymmdd(day);
    if (document.getElementById(yyyymmdd)) continue;

    create_single_element_tag(day);

    var frame = {
      frame_id   : yyyymmdd + "-panel",
      bgn_unixtime : day,
      end_unixtime : day
    };

    plot_daily_graph_all(frame);
  }
}

function create_single_element_tag(unixtime) {
  var yyyymmdd = translate_unixtime_to_yyyymmdd(unixtime);

  var origin   = new Date(1000*unixtime);
  var month    = ("0" + (origin.getMonth() + 1)).slice(-2);
  var day      = ("0" +  origin.getDate()      ).slice(-2);
  var day_of_w = ["日","月","火","水","木","金","土"][origin.getDay()];

  var obj_body = document.getElementsByTagName("body").item(0);

  var obj_element = document.createElement("div");
  obj_element.id  = yyyymmdd;
  obj_element.style="overflow:hidden";
  obj_body.appendChild(obj_element);

  var obj_info = document.createElement("div");
  obj_info.id  = yyyymmdd + "-info";
  obj_info.style="float:left;";
  obj_element.appendChild(obj_info);

  var obj_title = document.createElement("p");
  obj_title.id  = yyyymmdd + "-title";

  var title_str = month + "/" + day + "(" + day_of_w + ")";
  if      (day_of_w === "土") obj_title.innerHTML = "<font color='#0000FF'>"+title_str+"</font>";
  else if (day_of_w === "日") obj_title.innerHTML = "<font color='#FF0000'>"+title_str+"</font>";
  else                        obj_title.innerHTML = "<font color='#000000'>"+title_str+"</font>";
  obj_info.appendChild(obj_title);

  var obj_panel = document.createElement("div");
  obj_panel.id  = yyyymmdd + "-panel";
  obj_panel.style="float:right;";
  obj_element.appendChild(obj_panel);
}
