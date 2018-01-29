$(function () {
    // 基于准备好的dom，初始化echarts实例
    var myChartBar = echarts.init(document.getElementById('bar'));
    var myChartPie = echarts.init(document.getElementById('pie'));

    optionBar = {
        title: {
            text: "2017年注册人数"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var tar;
                if (params[1].value != '-') {
                    tar = params[1];
                }
                else {
                    tar = params[0];
                }
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
            type: 'value'
        },
        legend: {
            data: ['人数']
        },
        series: [{
            name: '辅助',
            type: 'bar',
            stack: '总量',
            itemStyle: {
                normal: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                }
            }
        }, {
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            name: "人数",
            data: [1000, 2000, 3700, 1400, 1200, 2200],
            type: 'bar'
        }]
    };


    optionPie = {
        title: {
            text: '热门品牌销售',
            subtext: '2017年6月',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            // orient: 'vertical',
            // top: 'middle',
            bottom: 10,
            left: 'center',
            data: ['耐克', '阿迪', '百伦', '李宁', '安踏']
        },
        series: [
            {
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                data: [
                    { value: 1548, name: '耐克' },
                    { value: 535, name: '阿迪' },
                    { value: 510, name: '百伦' },
                    { value: 634, name: '李宁' },
                    { value: 735, name: '安踏' }
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChartBar.setOption(optionBar);
    myChartPie.setOption(optionPie);

})