import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';

import './index.css';
import HomePage from './components/Homepage';
import CountryPage from './components/CountryPage';

import firebase from './firebase';
let firestore = firebase.firestore();
let ref = firestore.collection('countries');

let timeInterval = (t) => new Promise((res, rej) => setTimeout(_ => res(), t));

ReactDOM.render(
  <Router>
		<Switch>
			<Route exact path="/:country" component={CountryPage}/>
			<Route path="/" component={HomePage}/>
		</Switch> 
  </Router>,
  document.getElementById('root')
);