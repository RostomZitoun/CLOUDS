import React from 'react';

import './CovidSummary.css';

export default class CovidSummary extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        let execute = (resp) => {
            let data = this.props.extract(resp);
            this.setState({
                data
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
                    {this.state.data ?
                    <tbody>
                        <tr className="yellow">
                            <td>Total Cases</td>
                            <td>{ this.state.data.TotalConfirmed.toLocaleString('en') }</td>
                        </tr>
                        <tr className="yellow">
                            <td>New Cases</td>
                            <td>{ this.state.data.NewConfirmed.toLocaleString('en') }</td>
                        </tr>
                        <tr className="yellow">
                            <td>Active Cases</td>
                            <td>{ (this.state.data.TotalConfirmed - this.state.data.TotalRecovered).toLocaleString('en') }</td>
                        </tr>

                        <tr className="blue">
                            <td>Total Recovered</td>
                            <td>{ this.state.data.TotalRecovered.toLocaleString('en') }</td>
                        </tr>
                        <tr className="blue">
                            <td>New Recovered</td>
                            <td>{ this.state.data.NewRecovered.toLocaleString('en') }</td>
                        </tr>
                        <tr className="blue">
                            <td>Recovery Rate</td>
                            <td>{ (this.state.data.TotalRecovered/this.state.data.TotalConfirmed*100).toFixed(2).toLocaleString('en') + ' %' }</td>
                        </tr>

                        <tr className="red">
                            <td>Total Deaths</td>
                            <td>{ this.state.data.TotalDeaths.toLocaleString('en') }</td>
                        </tr>
                        <tr className="red">
                            <td>New Deaths</td>
                            <td>{ this.state.data.NewDeaths.toLocaleString('en') }</td>
                        </tr>
                        <tr className="red">
                            <td>Mortality Rate</td>
                            <td>{ (this.state.data.TotalDeaths/this.state.data.TotalConfirmed*100).toFixed(2).toLocaleString('en') + ' %' }</td>
                        </tr>
                    </tbody>
                        :
                    <tbody>
                        <tr><td>
                            <div className="loading">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </td></tr>
                    </tbody>
                    }
                    
                </table>
            </div>
        )
    }
};