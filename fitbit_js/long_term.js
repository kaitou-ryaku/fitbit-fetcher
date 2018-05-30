plot_long_term();

function plot_long_term() {
  var filename = "fitbit/csv_data/summary.csv";
  if (!(isFileExists(filename))) return;

  var xhr = null;
  // 使える場合はMicrosoft.XMLHTTP, 使えない場合はXMLHttpRequest
  try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) { xhr = new XMLHttpRequest(); }

  xhr.open("GET", filename, true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      var x = [];
      var ysteps = [];
      var ysleep = {
        wake     : [],
        rem      : [],
        light    : [],
        deep     : [],
        restless : [],
        asleep   : []
      };

      var lines = xhr.responseText.split(/\r\n|\r|\n/);
      for (var i = 1; i < lines.length;++i) {
        var line = lines[i].split(","); // YYYY-MM-DD, steps, wake, rem, light, deep, awake, restless, asleep
        var day = new Date(line[0]);
        x.push(day);

        ysteps.push(Number(line[1]));
        ysleep["wake"    ].push(Number(line[2])/3600.0 + Number(line[6])/3600.0);
        ysleep["rem"     ].push(Number(line[3])/3600.0);
        ysleep["light"   ].push(Number(line[4])/3600.0);
        ysleep["deep"    ].push(Number(line[5])/3600.0);
        ysleep["restless"].push(Number(line[7])/3600.0);
        ysleep["asleep"  ].push(Number(line[8])/3600.0);
      }

      plot_long_steps(x, ysteps);
      plot_long_sleep(x, ysleep);
    }
  }
  xhr.send();
}


function plot_long_steps(x, y) {
  var element = document.getElementById("daily-steps-panel");

  var dataset = [{
    x    : x,
    y    : y,
    type : 'bar',
    marker : {
      color   : "#008000",
    }
  }];

  var layout = {
    autosize   : false,
    width      : Math.round(window.innerWidth*0.9),
    height     : 200,
    margin     : {l:50, r:0, b:30, t:20, pad:0},
    showlegend : false,
    hovermode  : "closest",

    xaxis: {
      // autorange  : false,
      // range      : [x[0], x[-1]],
      dtick      : 7*24*3600*1000,
      tickformat : "%m/%d",
      autotick   : false,
      showgrid   : true,
      showline   : true,
      gridcolor  : "#C0C0C0",
      gridwidth  : 1,
    },

    yaxis: {
      range: [0, 16000],
      autotick: false,
      dtick: 2000,
    }
  };

  Plotly.plot(element, dataset, layout);
}

function plot_long_sleep(x, y) {

  var element = document.getElementById("daily-sleep-panel");

  var dataset = [
    {
      x    : x,
      y    : y["deep"],
      name : "deep",
      type : "bar",
      marker : {
        color   : "#000080",
      }
    }, {
      x    : x,
      y    : y["light"],
      name : "light",
      type : "bar",
      marker : {
        color   : "#4040FF",
      }
    }, {
      x    : x,
      y    : y["rem"],
      name : "rem",
      type : "bar",
      marker : {
        color   : "#B0B0FF",
      }
    }, {
      x    : x,
      y    : y["asleep"],
      name : "asleep",
      type : "bar",
      marker : {
        color   : "#000000",
      }
    }, {
      x    : x,
      y    : y["restless"],
      name : "restless",
      type : "bar",
      marker : {
        color   : "#4040FF",
      }
//    }, {
//      x    : x,
//      y    : y["wake"],
//      name : "wake",
//      type : "bar",
//      marker : {
//        color   : "#FF0080",
//      }
    }
  ];

  var layout = {
    autosize   : false,
    width      : Math.round(window.innerWidth*0.9),
    height     : 200,
    margin     : {l:50, r:0, b:30, t:20, pad:0},
    showlegend : false,
    hovermode  : "closest",
    barmode    : "stack",

    xaxis: {
      // autorange  : false,
      // range      : [x[0], x[-1]],
      dtick      : 7*24*3600*1000,
      tickformat : "%m/%d",
      autotick   : false,
      showgrid   : true,
      showline   : true,
      gridcolor  : "#C0C0C0",
      gridwidth  : 1,
    },

    yaxis: {
      range: [0, 10],
      autotick: false,
      dtick: 1,
    }
  };

  Plotly.plot(element, dataset, layout);
}

