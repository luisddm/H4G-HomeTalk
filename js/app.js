(function () {
  'use strict';

  const refreshInterval = 5000;

  const opts = {
    chart: {
      type: 'area',
      animation: false,
    },
    title: {
      text: 'Potencia',
    },
    xAxis: {
      categories: [],
    },
    yAxis: {
      title: {
        text: 'Potencia (W)',
      },
    },
    series: [
      {
        name: 'Data',
        data: [],
      },
    ],
  };

  const refresh = function () {
    $.ajax({
      url: 'http://localhost:3000/data',
      context: document.body,

    }).done(res => {

      opts.series[0].data = res.map(x => x.power);
      opts.xAxis.categories = res.map(x => moment(x.date).format('HH.mm:ss'));

      $('#highcharts').highcharts(opts);

      $('#current-value').text(res[9].power + 'W');
      $('#current-status').text(res[9].status ? 'ON' : 'OFF');

      if (res[9].power > 1500) {
        $('#bgcolor1').css('background-color', 'red');
        $('#bgcolor2').css('background-color', 'black');

      } else {
        $('#bgcolor1').css('background-color', 'green');
        $('#bgcolor2').css('background-color', 'gray');
      }
    });

  };

  refresh();

  setInterval(() => {
    refresh();
  }, refreshInterval);

})();
