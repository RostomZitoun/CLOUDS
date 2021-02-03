import React from 'react';
import {Link} from 'react-router-dom';

import './CovidTable.css';
import arrow_up from './arrow_up.png';
import arrow_up_active from './arrow_up_active.png';

export default class CovidSummary extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null,
            sortMethod: null,
        }
    }

    componentDidMount() {
        let execute = (resp) => {
            let data = this.props.extract(resp);
            this.setState({
                data, sortMethod: [0, 0] //column 0, increasing
            }); //will update from template
        };

        let retry = () => {
            this.props.load().then(
                resp => resp.json()
            ).then(
                execute
            ).catch(err => retry);
        }; retry();
    }

    UNSAFE__componentWillUpdate() {
        if ( this.state.am4chart )
            this.state.am4chart.dispose();
    } 

    sort(order) {
        if ( this.state.sortMethod[0] == order[0] && this.state.sortMethod[1] == order[1] )
            return;
        
        let fields = ['Country', 'NewConfirmed', 'TotalConfirmed', 'NewRecovered', 'TotalRecovered', 'NewDeaths', 'TotalDeaths'];
        let data = this.state.data.sort((x, y) => -1 + 2*(x[fields[order[0]]] > y[fields[order[0]]]));
        if ( order[1] ) data.reverse();

        this.setState({
            data:data, sortMethod: order
        }, () => {
            document.querySelector('.sort_active').classList.remove('sort_active');
            document.querySelector(`.summary.table thead tr:nth-of-type(2) td:nth-of-type(${1 + order[0]}) i:nth-of-type(${2-order[1]})`).classList.add('sort_active');
        });
    }

    render() {
        return (
            <div>
                <h1 className="grey header">{this.props.title}</h1>
                {this.state.data ? 
                    <table className="summary table">
                        <thead>
                            <tr>
                                <td><span>Country</span></td>
                                <td><span>New Cases</span></td>
                                <td><span>Total Cases</span></td>
                                <td><span>New Recoveries</span></td>
                                <td><span>Total Recoveries</span></td>
                                <td><span>New Deaths</span></td>
                                <td><span>Total Deaths</span></td>
                            </tr>
                            <tr>
                                <td><i onClick={() => this.sort([0, 1])} className="arrow_up"/><i onClick={() => this.sort([0, 0])} className="arrow_down sort_active"/></td>
                                <td><i onClick={() => this.sort([1, 1])} className="arrow_up"/><i onClick={() => this.sort([1, 0])} className="arrow_down"/></td>
                                <td><i onClick={() => this.sort([2, 1])} className="arrow_up"/><i onClick={() => this.sort([2, 0])} className="arrow_down"/></td>
                                <td><i onClick={() => this.sort([3, 1])} className="arrow_up"/><i onClick={() => this.sort([3, 0])} className="arrow_down"/></td>
                                <td><i onClick={() => this.sort([4, 1])} className="arrow_up"/><i onClick={() => this.sort([4, 0])} className="arrow_down"/></td>
                                <td><i onClick={() => this.sort([5, 1])} className="arrow_up"/><i onClick={() => this.sort([5, 0])} className="arrow_down"/></td>
                                <td><i onClick={() => this.sort([6, 1])} className="arrow_up"/><i onClick={() => this.sort([6, 0])} className="arrow_down"/></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((data, idx) => (
                                <tr key={idx}>
                                    <td><Link to={"/" + data.Slug}>{data.Country}</Link></td>
                                    <td>{data.NewConfirmed.toLocaleString('en')}</td>
                                    <td>{data.TotalConfirmed.toLocaleString('en')}</td>
                                    <td>{data.NewRecovered.toLocaleString('en')}</td>
                                    <td>{data.TotalRecovered.toLocaleString('en')}</td>
                                    <td>{data.NewDeaths.toLocaleString('en')}</td>
                                    <td>{data.TotalDeaths.toLocaleString('en')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    :
                    <table className="summary">
                        <tbody>
                            <tr><td>
                                <div className="loading">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </td></tr>
                        </tbody>
                    </table>
                }
            </div>
        )
    }
};