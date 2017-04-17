console.log('Hello World!');


$(document).ready(function() {

  loadChartData()
    .then(updateChart)
    .catch(errorHandler);

});


function errorHandler(err) {
  console.trace(err);
}



function loadChartData() {
  var MIN_5 = 300;
  var MIN_15 = 900;
  var MIN_30 = 1800;
  var HOUR_2 = 7200;
  var HOUR_4 = 14400;
  var DAY_1 = 86400;

  var USD_BTC = '&currencyPair=USDT_BTC';
  var TIME_RANGE = '&start=1405699200&end=9999999999';

  return new Promise(function (resolve, reject) {
    //var url = 'https://poloniex.com/public?command=returnChartData&currencyPair=USDT_BTC&start=1405699200&end=9999999999&period=14400';
    var baseUrl = 'https://poloniex.com/public?command=returnChartData';

    var url1day = baseUrl + USD_BTC + TIME_RANGE + '&period='+DAY_1;

    var cacheUrl1day = 'http://127.0.0.1:8080/files/polo-USDT_BTC-day.json';
    var cacheUrlPoloUsdBtc = 'http://127.0.0.1:8080/files/polo-USDT_BTC.json';

    var url = cacheUrl1day;
    $.getJSON(url).done(function(data) {
      var mappedData = data.map(function(record){
        return [record.date*1000, record.weightedAverage];
      });
      resolve(mappedData);
    }).fail(reject);
  });
}

function updateChart(data) {
  console.log('[MAIN] Polo chart data records %d', data.length);

  var price = data[data.length - 1][1];
  price = price.toFixed(2, 10);

  var options = {
    title: {
      text: "$"+price+" USD / BTC",
      style: {
        fontSize: '3em'
      }
    },
    subtitle: {
      text: "source: poloniex",
      style: {
        color: '#707073'
      }
    },
    legend: {
      enabled: false
    },
    chart: {
      renderTo: 'dashboard',
      type: 'area'
    },
    plotOptions: {
      series: {
        fillColor: {
          linearGradient: {
            x1: 0.5,
            y1: 0,
            x2: 0.5,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
        }
      }
    },
    yAxis: {
      title: {
        text: "Price (USD)"
      },
      labels: {
        style: {
          fontSize: '2em'
        }
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%m / %Y}',
        align: 'right',
        rotation: -30,
        style: {
          fontSize: '2em'
        }
      }
    },
    series: [{
      name: "USD / BTC",
      animation: false,
      data: []
    }]
  };

  //Highcharts.dateFormat("Month: %m Day: %d Year: %Y", 20, false);

  options.series[0].data = data;
  console.log('[UpdateChart] options %o', options);
  try {
    //var chart = new Highcharts.Chart(options);
    var chart = Highcharts.chart('dashboard', options);
  } catch (err) {
    console.error(err);
  }
  return chart;



}
