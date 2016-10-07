import {Component, Output, Input, EventEmitter, ElementRef, ViewChild} from '@angular/core';

@Component({
    selector: 'timeline-chart',
    templateUrl: 'timeline-chart.html'
})
export class TimelineChartComponent {
    @Output() timelineChartLoad: EventEmitter<any> = new EventEmitter();
    @Output() timelineChartEvent: EventEmitter<any> = new EventEmitter();
    @ViewChild('timelineChartInner') timelineChartInner: ElementRef;
    public timelineOptions: Object;
    public chart: Object;

    constructor() {
        this.timelineOptions = {
            chart: {
                type: 'line',
                zoomType: '',
                title: '',
                animation: false,
                spacingBottom: 0,
                spacingTop: 0,
                spacingLeft: 0,
                spacingRight: 0,
                backgroundColor: 'black'
            },
            colors: ['#7cb5ec', '#fffe00', 'ff3b99', '00c864'],
            title: {
                text: null
            },
            tooltip: {
                enabled: false
            },
            series: [{
                data: []
            }],
            legend: {
                enabled: false
            },
            yAxis: [{
                offset: 0,
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                }
            }, {
                offset: 0,
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                }
            }],
            credits: {
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                tickWidth: 0,
                plotBands: [{
                    color: 'rgba(182,191,190,0.5)',
                    from: 0,
                    to: 0,
                    id: 'plot-band-1'
                },{
                    color: 'rgba(182,191,190,0.5)',
                    from: 0,
                    to: 0,
                    id: 'plot-band-2'
                }],
                plotLines: [{
                    value: 0,
                    color: 'rgba(182,191,190,0.5)',
                    width: 10,
                    id: 'left',
                    zIndex: 100
                }, {
                    value: 0,
                    color: 'rgba(182,191,190,0.5)',
                    width: 10,
                    id: 'right',
                    zIndex: 100
                }]
            },
            plotOptions: {
                series: {
                    pointInterval: 2,
                    pointStart: 0,
                    stickyTracking: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                line: {
                    marker: {
                        enabled: false
                    }
                }
            }
        };
    }

    //Called on timeline chart load
    onTimelineLoad(chartInstance) {
        this.chart = chartInstance;
        this.timelineChartLoad.emit(this);
    }

    timelineChartEventExporter(event, type: string) {
        this.timelineChartEvent.emit({
            ev: event, 
            type: type
        });
    }

}