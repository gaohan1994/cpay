export const line_chart_options: any = (data: any) => {
  let series = [];
  let legendData = [];
  if (data && data.firmData) {
    for (const key in data.firmData) {
      if (Object.prototype.hasOwnProperty.call(data.firmData, key)) {
        const element = data.firmData[key];
        legendData.push(key === 'allData' ? data.deptName || 'allData' : key);
        series.push({
          name: key === 'allData' ? data.deptName || 'allData' : key,
          type: 'line',
          data: element,
          smooth: true,
        })
      }
    }
  }
  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legendData
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
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data && data.month || [],
    },
    yAxis: {
      type: 'value',
    },
    series: series
  }
}