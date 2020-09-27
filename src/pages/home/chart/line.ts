export function line_option(data: any): any {
  const { connectedCount, unconnectedCount, createTimeTerm } = data;
  function getTotalCount(array1: number[] = [], array2: number[] = []): number[] {
    let totalCountArray: number[] = [];
    for (let i = 0; i < array1.length; i++) {
      totalCountArray[i] = array1[i] + array2[i]
    }
    return totalCountArray;
  }

  const option = {
    title: {
      show: true,
      text: '终端统计'
    },
    tooltip: {},
    legend: {
      data: ['终端总数', '激活总数']
    },
    xAxis: {
      type: 'category',
      data: createTimeTerm,
    },
    yAxis: {},
    series: [{
      name: '终端总数',
      type: 'line',
      data: getTotalCount(connectedCount, unconnectedCount),
      smooth: true,
    }, {
      name: '激活总数',
      type: 'line',
      data: connectedCount,
      smooth: true,
    }]
  };
  return option
}
