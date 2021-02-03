import React from 'react';

import './DailyCovid.css';

let {am4core, am4charts} = window;

export default class DailyCovid extends React.Component {
    constructor() {
        super();
        this.state = {am4chart: false, data: null};
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ( this.state.data == null )
            return true;
        return false;
    }

    UNSAFE__componentWillUpdate() {
        if ( this.state.am4chart )
            this.state.am4chart.dispose();
    } 

    componentDidMount() {
        am4core.ready(() => {
            //create chart
            am4core.useTheme(target => {
                target.list = [
                    am4core.color("#c44569"),
                    am4core.color("#546de5"),
                    am4core.color("#f5cd79")
                ];
            });
            let chart = am4core.create("covidxycluster" + this.props.name, am4charts.XYChart);
            chart.legend = new am4charts.Legend()
            chart.legend.position = 'bottom'
            chart.legend.markers.template.width = chart.legend.markers.template.height = 10;
            chart.legend.fontSize = 12;
            let marker = chart.legend.markers.template.children.getIndex(0);
            chart.legend.labels.template.fill = am4core.color('#fff');
            chart.legend.valueLabels.template.fill = am4core.color('#fff');
            marker.cornerRadius(3, 3, 3, 3);

            let xAxis = chart.xAxes.push(new am4charts.DateAxis())
            xAxis.dataFields.category = 'day'
            xAxis.renderer.cellStartLocation = 0;
            xAxis.renderer.cellEndLocation = 1;
            xAxis.renderer.grid.template.location = 0;
            xAxis.renderer.labels.template.fill = am4core.color("#fff");

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.renderer.labels.template.fill = am4core.color("#fff");
            yAxis.min = 0;

            let createSeries = (value, name) => {
                let series = chart.series.push(new am4charts.ColumnSeries())
                series.dataFields.valueY = value;
                series.dataFields.dateX = 'Date';
                series.name = name;
                series.tooltipText = "{valueY}";
            
                return series;
            }

            createSeries('Deaths', 'Total Deaths');
            createSeries('Recovered', 'Total Recovered');
            createSeries('Confirmed', 'Total Confirmed');
            chart.cursor = new am4charts.XYCursor();
            window.cursor = chart.cursor;

            chart.cursor.xAxis = xAxis;
            chart.cursor.fullWidthLineX = true;
            chart.cursor.lineX.fill = am4core.color("#fff");
            chart.cursor.lineX.fillOpacity = 0.2;
            xAxis.cursorTooltipEnabled = false;

            this.setState({am4chart: chart}, () => {
                if ( this.state.data ) { 
                    chart.data = this.state.data;
                } 
            });           
        });

        let execute = (resp) => {
            let data = this.props.extract(resp);

            this.setState({
                data
            }, () => {
                if ( this.state.am4chart ) {
                    let chart = this.state.am4chart;
                    chart.data = data;
                }
            });
        };

        let retry = () => {
            this.props.load().then(
                resp => resp.json()
            ).then(
                execute
            ).catch(err => retry);
        }; retry();
    }

    render() {
        return (
            <div>
                <h1 className="grey header">{this.props.title}</h1>
                <table className="summary">
                    <tbody style={{display: !this.state.data ? "none" : "table"}}>
                        <tr><td className="covidxycluster" id={"covidxycluster" + this.props.name}>
                        </td></tr>
                    </tbody>

                    {this.state.data == null ?
                        <tbody className="full">
                        <tr><td>
                                <div className="loading">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </td></tr>
                        </tbody>
                        :
                        null
                    }
                </table>
            </div>
        );
    }
}