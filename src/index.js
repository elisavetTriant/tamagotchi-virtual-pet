import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from "react-router-dom";
import App from './containers/App';
import Welcome from './containers/Welcome';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  
   <HashRouter>
		<Switch>
           <Route exact path="/" component={Welcome} />
           <Route path="/play/:petName?/:dayDurationInSeconds?" component={App} />
        </Switch>
	</HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);