import React from 'react';

import './CovidPie.css';

let {am4core, am4charts} = window;

export default class CovidPie extends React.Component {
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
            
            let chart = am4core.create("covidpiechart_" + this.props.name, am4charts.PieChart);
            let pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "count";
            pieSeries.dataFields.category = "label";

            chart.radius = '100px';
            chart.innerRadius = am4core.percent(25);

            pieSeries.ticks.template.disabled = true;
            pieSeries.alignLabels = false;
            pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
            pieSeries.labels.template.radius = am4core.percent(-40);
            pieSeries.labels.template.fill = am4core.color("#fff");

            pieSeries.labels.template.adapter.add("radius", function(radius, target) {
                if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                    return 0;
                }
                return radius;
            });

            pieSeries.labels.template.adapter.add("fill", function(color, target) {
                if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                    return am4core.color("#fff");
                }
                return color;
            });

            chart.legend = new am4charts.Legend();
            chart.legend.markers.template.width = chart.legend.markers.template.height = 10;
            chart.legend.fontSize = 12;
            let marker = chart.legend.markers.template.children.getIndex(0);
            chart.legend.labels.template.fill = am4core.color('#fff');
            chart.legend.valueLabels.template.fill = am4core.color('#fff');
            marker.cornerRadius(3, 3, 3, 3);
            
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
                        <tr><td className="covidpiechart" id={"covidpiechart_" + this.props.name}>
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