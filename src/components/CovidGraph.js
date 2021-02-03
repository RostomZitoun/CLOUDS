import React from 'react';
import './CovidGraph.css';
let {am4core, am4charts} = window;

export default class CovidGraph extends React.Component {
    constructor() {
        super();
        this.state = {am4chart: false, data: null};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState.data == null);
    }

    UNSAFE__componentWillUpdate() {
        if ( this.state.am4chart )
            this.state.am4chart.dispose();
    } 

    componentDidMount() {
        am4core.ready(() => {
            am4core.useTheme(target => {
                target.list = [
                    am4core.color("#c44569"),
                    am4core.color("#546de5"),
                    am4core.color("#f5cd79")
                ];
            });

            let chart = am4core.create("covidgraph_" + this.props.name, am4charts.XYChart);
            let xAxis = chart.xAxes.push(new am4charts.DateAxis());
            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());

            xAxis.renderer.labels.template.fill = am4core.color("#fff");
            yAxis.renderer.labels.template.fill = am4core.color("#fff");

            let  createSeries = (field, name, opposite=true) => {
                let series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = field;
                series.dataFields.dateX = "Date";
                series.strokeWidth = 4;
                series.yAxis = yAxis;
                series.name = name;
                series.tooltipText = "{name}: [bold]{valueY}[/]";
                series.fillOpacity = 0.1;

                // valueAxis.renderer.line.disabled = true; //disables axis line
                // valueAxis.renderer.labels.template.disabled = true; //disables labels
                // valueAxis.renderer.grid.template.disabled = true;  //disables grid
                // valueAxis.cursorTooltipEnabled = false;
            }

            createSeries("Deaths", "Total Deaths");
            createSeries("Recovered", "Total Recovered");
            createSeries("Confirmed", "Total Cases");

            chart.legend = new am4charts.Legend();
            chart.legend.position = 'top';
            chart.legend.markers.template.width = chart.legend.markers.template.height = 20;
            chart.legend.fontSize = 12;
            chart.legend.labels.template.fill = am4core.color('#fff');
            chart.legend.valueLabels.template.fill = am4core.color('#fff');
            
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = xAxis;
            chart.cursor.fullWidthLineX = true;
            chart.cursor.lineX.fill = am4core.color("#fff");
            chart.cursor.lineX.fillOpacity = 0.2;
            
            this.setState({am4chart: chart}, () => {
                if ( this.state.data )
                    chart.data = this.state.data;
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
                        <tr><td className="covidgraph" id={"covidgraph_" + this.props.name}>
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