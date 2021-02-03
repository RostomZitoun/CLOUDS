import React from 'react';

import CovidSummary from './CovidSummary';
import CovidPie from './CovidPie';
import DailyCovid from './DailyCovid';
import CovidGraph from './CovidGraph';

export default class CountryPage extends React.Component {
    constructor() {
        super();
    }

    countryName(name) {
        return name.split('-').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
    }

    render() {
        let country = this.props.match.params.country;
        console.log(country)
        return (
            <div class="country page">
                <CovidSummary title={"Coronavirus Summary In " + this.countryName(country)} load={() => fetch('https://api.covid19api.com/summary')} extract={(resp) => {
                    let countries = resp.Countries;
                    for ( var i = 0; i < countries.length; i++ )
                        if ( countries[i].Slug == country )
                            break;
                    
                    if ( i == countries.Slug )
                        return null; //won't render
                    return countries[i];
                }}/>

                <CovidPie title={"Coronavirus Cases Distribution In " + this.countryName(country)} name={country} load={() => fetch("https://api.covid19api.com/summary")} extract={resp => {
                    let countries = resp.Countries;
                    for ( var i = 0; i < countries.length; i++ )
                        if ( countries[i].Slug == country )
                            break;
                    
                    if ( i == countries.Slug )
                        return null; //won't render

                    console.log(countries[i]);
                    return [
                        {label: "Dead Cases", count: countries[i].TotalDeaths},
                        {label: "Recovered Cases", count: countries[i].TotalRecovered},
                        {label: "Active Cases", count: countries[i].TotalConfirmed - countries[i].TotalRecovered}
                    ];
                }}/>

                <DailyCovid title={"Daily Coronavirus Cases In " + this.countryName(country)} name={country} load={() => fetch("https://api.covid19api.com/total/country/" + country)} extract={resp => {
                    resp = resp.slice(-8);
                    for ( let i = 7; i >= 1; i-- ) {
                        resp[i].Deaths -= resp[i-1].Deaths;
                        resp[i].Confirmed -= resp[i-1].Confirmed;
                        resp[i].Recovered -= resp[i-1].Recovered;
                    }
                    return resp.slice(-7);
                }}/>

                <CovidGraph title={"Total Coronavirus Cases In " + this.countryName(country)} name="france" load={() => fetch("https://api.covid19api.com/total/country/" + country)} extract={resp => {
                    return resp;
                }} />
            </div>
        )
    }
}