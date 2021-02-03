import React from 'react';

import CovidSummary from './CovidSummary';
import CovidPie from './CovidPie';
import DailyCovid from './DailyCovid';
import CovidGraph from './CovidGraph';
import CovidTable from './CovidTable';

let dailyData = [ //get from firebase
	{
		Deaths: 15791,
		Confirmed: 670392,
		Recovered: 517882,
		Date: Date.parse('06 Jan 2021 00:00:00 GMT')
	}, {
		Deaths: 9534,
		Confirmed: 586318,
		Recovered: 470722,
		Date: Date.parse('07 Jan 2021 00:00:00 GMT'),
	}, {
		Deaths: 9265,
		Confirmed: 639061,
		Recovered: 343798,
		Date:  Date.parse('08 Jan 2021 00:00:00 GMT')
	}, {
		Deaths: 12820,
		Confirmed: 761531,
		Recovered: 469297,
		Date: Date.parse('09 Jan 2021 00:00:00 GMT')
	}, {
		Deaths: 15028,
		Confirmed: 839312,
		Recovered: 413558,
		Date: Date.parse('10 Jan 2021 00:00:00 GMT')
	}, {
		Deaths: 14884,
		Confirmed: 833433,
		Recovered: 469222,
		Date: Date.parse('11 Jan 2021 00:00:00 GMT')
	}, {
		Deaths: 14844,
		Confirmed: 808271,
		Recovered: 527852,
		Date: Date.parse('12 Jan 2021 00:00:00 GMT')
	}
].reverse(); dailyData.json = () => dailyData;
//DailyCovid and Covid graph need worldwide data, couldn't get it easily from API

export default class HomePage extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="home page">
                <CovidSummary title="Coronavirus Summary Worldwide" load={() => fetch('https://api.covid19api.com/summary')} extract={(resp) => resp.Global}/>

                <CovidPie title="Coronavirus Cases Distribution Worldwide" name="worldwide" load={() => fetch("https://api.covid19api.com/summary")} extract={resp => {
                    return [
                        {label: "Dead Cases", count: resp.Global.TotalDeaths},
                        {label: "Recovered Cases", count: resp.Global.TotalRecovered},
                        {label: "Active Cases", count: resp.Global.TotalConfirmed - resp.Global.TotalRecovered}
                    ];
                }}/>

                <DailyCovid title="Daily Coronavirus Cases in France" name="worldwide" load={() => fetch("https://api.covid19api.com/total/country/france")} extract={resp => {
                    resp = resp.slice(-8);
                    for ( let i = 7; i >= 1; i-- ) {
                        resp[i].Deaths -= resp[i-1].Deaths;
                        resp[i].Confirmed -= resp[i-1].Confirmed;
                        resp[i].Recovered -= resp[i-1].Recovered;
                    }
                    return resp.slice(-7);
                }}/>
                <CovidGraph title="Total Coronavirus Cases in France" name="france" load={() => fetch("https://api.covid19api.com/total/country/france")} extract={resp => {
                    return resp;
                }} />
                <CovidTable title="Coronavirus Cases By Country" load={() => fetch('https://api.covid19api.com/summary')} extract={resp => resp.Countries.sort(x => x.Country)}></CovidTable>
            </div>
        )
    }
}