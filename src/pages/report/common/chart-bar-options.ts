const categories = [
  { key: 'number', label: '任务数' },
  { key: 'successUpdate', label: '更新成功' },
  { key: 'successDownload', label: '下载成功' },
  { key: 'failureDownload', label: '下载失败' },
  { key: 'failureUpdate', label: '更新（卸载）失败' },
  { key: 'waitSend', label: '等待下发' },
]

export const bar_chart_options: any = (data: any) => {
  let list: any[] = [];
  if (data && Array.isArray(data.list)) {
    // if (data.list.length > 10) {
    //   list = data.list.slice(0, 10);
    // } else {
    //   list = data.list;
    // }
    list = data.list;
  }
  let series = [];
  let jobName: string[] = [];
  let seriesData: any = {};
  for (let i = 0; i < categories.length; i++) {
    seriesData[categories[i].key] = [];
  }

  for (let i = 1; i < list.length; i++) {
    jobName.push(list[i].jobName);
    for (let j = 0; j < categories.length; j++) {
      seriesData[categories[j].key].push(list[i][categories[j].key]);
    }
  }

  for (let i = 0; i < categories.length; i++) {
    series.push({
      name: categories[i].label,
      smooth: true,
      type: 'bar',
      data: seriesData[categories[i].key]
    })
  }

  return {
    grid: {
      bottom: 80
    },
    legend: {},
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        magicType: { type: ['line', 'bar', 'stack', 'tiled'] },
        restore: {},
        saveAsImage: {}
      }
    },
    dataZoom: [{
      type: 'slider',//图表下方的伸缩条
      show: true, //是否显示
      realtime: true, //拖动时，是否实时更新系列的视图
      start: 0, //伸缩条开始位置（1-100），可以随时更改
      end: (5 / list.length) * 100 || 100, //伸缩条结束位置（1-100），可以随时更改
      maxSpan: (10 / list.length) * 100,
    }],
    xAxis: [
      {
        name: '任务名称',
        type: 'category',
        data: jobName,
        axisLabel: {
          interval: 0,
          formatter: function (params: any){   //标签输出形式 ---请开始你的表演
            var index = 10;
            var newstr = '';
            for(var i=0;i<params.length;i+=index){
                var tmp=params.substring(i, i+index);
                newstr+=tmp+'\n';
            }
            if( newstr.length > 20)
                return newstr.substring(0,20) + '...';
            else
                return newstr;
        },
        }
      }
    ],
    yAxis: [
      {
        name: '任务数(个)',
        type: 'value',
      }
    ],
    series: series
  }
}