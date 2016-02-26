function refresh() {
  const data = {
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
        text: 'Potencia (w)',
      },
    },
    series: [
      {
        name: 'Data',
        data: [],
      },
    ],
  };

  $.ajax({
    url: 'http://localhost:3000/posts',
    context: document.body,
  }).done(res => {
    //console.log(res.map(x => x.power));
    data.series[0].data = res.map(x => x.power);
    data.xAxis.categories = res.map(x => moment(x.date).format('HH.mm:ss'));
    $('#container').highcharts(data);
    $('#current-value').text(res[9].power + 'w');
    $('#current-status').text(res[9].status ? 'ON' : 'OFF');
    if (res[9].power > 1500) {
      $('#bgcolor1').css('background-color', 'red');
      $('#bgcolor2').css('background-color', 'black');
    } else {
      $('#bgcolor1').css('background-color', 'green');
      $('#bgcolor2').css('background-color', 'gray');
    }
  });

}

refresh();

setInterval(t => {
  refresh();
}, 5000);
