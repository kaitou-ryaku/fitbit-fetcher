plot_long_term();

function plot_long_term() {
  var filename = "fitbit/csv_data/summary.csv";
  if (!(isFileExists(filename))) return;

  var xhr = null;
  // 使える場合はMicrosoft.XMLHTTP, 使えない場合はXMLHttpRequest
  try { xhr = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) { xhr = new XMLHttpRequest(); }

  xhr.open("GET", filename, true);
  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4) {
      var x = [];
      var ylackm = [];
      var ysteps = [];
      var ysleep = {
        wake     : [],
        rem      : [],
        light    : [],
        deep     : [],
        restless : [],
        asleep   : []
      };
      var yheart = [];
      var ycalory = [];

      var lines = xhr.responseText.split(/\r\n|\r|\n/);
      for (var i = 1; i < lines.length;++i) {
        var line = lines[i].split(","); // YYYY-MM-DD, lackSecond, steps, wake, rem, light, deep, awake, restless, asleep, heartLineNum, restingHeartRate, cal, m, cal, m, cal, m, cal, m
        var day = new Date(line[0]);
        x.push(day);

        ylackm.push(Number(line[1])/60.0);
        ysteps.push(Number(line[2]));
        ysleep["wake"    ].push(Number(line[3])/3600.0 + Number(line[7])/3600.0);
        ysleep["rem"     ].push(Number(line[4])/3600.0);
        ysleep["light"   ].push(Number(line[5])/3600.0);
        ysleep["deep"    ].push(Number(line[6])/3600.0);
        ysleep["restless"].push(Number(line[8])/3600.0);
        ysleep["asleep"  ].push(Number(line[9])/3600.0);
        yheart.push(Number(line[11]));
        ycalory.push(Number(line[12]) + Number(line[14]) + Number(line[16]) + Number(line[18]));
      }

      plot_long_steps(x, ysteps);
      plot_long_sleep(x, ysleep);
      plot_long_lackm(x, ylackm);
      plot_long_heart(x, yheart);
      plot_long_calory(x, ycalory);
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
    width      : Math.round(window.innerWidth )*0.8,
    height     : Math.round(window.innerHeight)*0.2,
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
    },

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
    width      : Math.round(window.innerWidth )*0.8,
    height     : Math.round(window.innerHeight)*0.2,
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

function plot_long_lackm(x, y) {
  var element = document.getElementById("daily-lack-panel");

  var dataset = [{
    x    : x,
    y    : y,
    type : 'bar',
    marker : {
      color   : "#000000",
    }
  }];

  var layout = {
    autosize   : false,
    width      : Math.round(window.innerWidth )*0.8,
    height     : Math.round(window.innerHeight)*0.2,
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
      range: [0, 90],
      autotick: false,
      dtick: 10,
    },

  };

  Plotly.plot(element, dataset, layout);
}

function plot_long_heart(x, y) {
  var element = document.getElementById("daily-heart-panel");

  var dataset = [{
    x    : x,
    y    : y,
    type : 'scatter',
    mode : 'lines',
    line : {
      color   : "#FF0000",
      opacity : 0.5,
      width   : 1
    }
  }];

  var layout = {
    autosize   : false,
    width      : Math.round(window.innerWidth )*0.8,
    height     : Math.round(window.innerHeight)*0.2,
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
      range: [56, 68],
      autotick: false,
      dtick: 2,
    },

  };

  Plotly.plot(element, dataset, layout);
}

function plot_long_calory(x, y) {
  var element = document.getElementById("daily-calory-panel");

  var dataset = [{
    x    : x,
    y    : y,
    type : 'bar',
    marker : {
      color   : "#C0C040",
    }
  }];

  var layout = {
    autosize   : false,
    width      : Math.round(window.innerWidth )*0.8,
    height     : Math.round(window.innerHeight)*0.2,
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
      range: [1400, 3000],
      autotick: false,
      dtick: 200,
    },

  };

  Plotly.plot(element, dataset, layout);
}
