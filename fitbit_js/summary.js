function print_summary_data(day_unixtime) {
  var yyyymmdd = translate_unixtime_to_yyyymmdd(day_unixtime);
  var summary  = document.getElementById(yyyymmdd + "-summary");

  var filename = "fitbit/csv_data/summary.csv";
  if (!(isFileExists(filename))) return;

  var xhr = null;
  // 使える場合はMicrosoft.XMLHTTP, 使えない場合はXMLHttpRequest
  try { xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) { xhr = new XMLHttpRequest(); }

  xhr.open("GET", filename, true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      var lines = xhr.responseText.split(/\r\n|\r|\n/);
      for (var i = 1; i < lines.length; i++) {
        var line = lines[i].split(","); // YYYY-MM-DD, steps, wake, rem, light, deep, awake, restless, asleep
        if (line[0] != translate_unixtime_to_yyyymmdd(day_unixtime)) continue;
        var tmp_day = new Date(line[0]);

        var obj_main_kpi        = document.createElement("div");
        obj_main_kpi.className  = "kpi";
        summary.appendChild(obj_main_kpi);

        var obj_steps           = document.createElement("p");
        obj_steps.className     = "steps_kpi";
        obj_steps.innerHTML     = line[1];
        obj_main_kpi.appendChild(obj_steps);

        var obj_sleep_sum       = document.createElement("p");
        obj_sleep_sum.className = "sleep_sum_kpi";
        obj_sleep_sum.innerHTML = second_to_hm(Number(line[3]) + Number(line[4]) + Number(line[5]) + Number(line[7]) + Number(line[8]));
        obj_main_kpi.appendChild(obj_sleep_sum);


        var obj_sleep_kpi       = document.createElement("div");
        obj_sleep_kpi.className = "sleep_kpi";
        summary.appendChild(obj_sleep_kpi);

        var obj_wake            = document.createElement("p");
        obj_wake.className      = "wake_kpi";
        obj_wake.innerHTML      = second_to_hm(Number(line[2]) + Number(line[6]));
        obj_sleep_kpi.appendChild(obj_wake);

        var obj_rem             = document.createElement("p");
        obj_rem.className       = "rem_kpi";
        obj_rem.innerHTML       = second_to_hm(Number(line[3]));
        obj_sleep_kpi.appendChild(obj_rem);

        var obj_light           = document.createElement("p");
        obj_light.className     = "light_kpi";
        obj_light.innerHTML     = second_to_hm(Number(line[4]));
        obj_sleep_kpi.appendChild(obj_light);

        var obj_deep            = document.createElement("p");
        obj_deep.className      = "deep_kpi";
        obj_deep.innerHTML      = second_to_hm(Number(line[5]));
        obj_sleep_kpi.appendChild(obj_deep);
      }
    }
  }
  xhr.send();
}
