export function bar_option(data: any): any {
  const { totalApp, publishedApp, createTimeApp } = data;
  console.log('createTimeApp', createTimeApp);
  const option = {
    title: {
      show: true,
      text: '应用统计'
    },
    tooltip: {},
    legend: {
      data: ['应用总数', '发布应用']
    },
    xAxis: {
      type: 'category',
      data: createTimeApp,
    },
    yAxis: {},
    series: [{
      name: '应用总数',
      type: 'bar',
      data: totalApp,
    }, {
      name: '发布应用',
      type: 'bar',
      data: publishedApp,
    }]
  };
  return option
}