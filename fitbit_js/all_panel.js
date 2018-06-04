var current_day_unixtime = new Date().setHours(0,0,0,0)/1000;

create_single_element(current_day_unixtime);
current_day_unixtime -= 24*3600;

var sw = document.getElementById("scroll-wrap");
sw.onscroll = function(){
  if (sw.offsetHeight + sw.scrollTop > sw.scrollHeight * 0.95) {
    create_single_element(current_day_unixtime);
    current_day_unixtime -= 24*3600;
  }
}

function create_single_element(day_unixtime) {
  var yyyymmdd = translate_unixtime_to_yyyymmdd(day_unixtime);
  if (document.getElementById(yyyymmdd + "-element")) return;

  create_single_element_tag(day_unixtime);
  print_summary_data(day_unixtime);

  var frame = {
    frame_id     : yyyymmdd + "-panel",
    bgn_unixtime : day_unixtime,
    end_unixtime : day_unixtime
  };

  plot_daily_graph_all(frame);
}

function create_single_element_tag(unixtime) {
  var yyyymmdd = translate_unixtime_to_yyyymmdd(unixtime);
  if (document.getElementById(yyyymmdd + "-element")) return;

  var origin   = new Date(1000*unixtime);
  var month    = ("0" + (origin.getMonth() + 1)).slice(-2);
  var day      = ("0" +  origin.getDate()      ).slice(-2);
  var day_of_w = ["日","月","火","水","木","金","土"][origin.getDay()];
  var day_of_w_type = "";
  if      (day_of_w === "土") day_of_w_type = "saturday";
  else if (day_of_w === "日") day_of_w_type = "sunday"  ;
  else                        day_of_w_type = "weekday" ;

  var obj_body = document.getElementById("daily-span");

  var obj_element = document.createElement("div");
  obj_element.className = "element-" + day_of_w_type;
  obj_body.appendChild(obj_element);

  var obj_info = document.createElement("div");
  obj_info.className = "info";
  obj_element.appendChild(obj_info);

  var obj_title = document.createElement("p");
  obj_title.innerHTML = month + "/" + day + " (" + day_of_w + ")";
  obj_title.className = "title-" + day_of_w_type;
  obj_info.appendChild(obj_title);

  var obj_summary = document.createElement("div");
  obj_summary.className  = "summary";
  obj_summary.id = yyyymmdd + "-summary";
  obj_info.appendChild(obj_summary);

  var obj_panel = document.createElement("div");
  obj_panel.className = "panel";
  obj_panel.id = yyyymmdd + "-panel";
  obj_element.appendChild(obj_panel);
}
