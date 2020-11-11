//import dotenv from 'dotenv'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import { enableMapSet } from 'immer'
import * as serviceWorker from './serviceWorker';
import AzureAuthCallback from './views/azure_auth_callback';
import Main from './views/main/Main';
import Landing from './views/landing';
import {Login} from './views/login/Login';
import {store} from './store'
import {configureApi} from './api/plun_api';

enableMapSet()

configureApi()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/azure-auth-callback" component={AzureAuthCallback}/>
          <Route path="/app" component={Main}/>
          <Route path="/login" component={Login}/>
          <Route path="/" component={Landing}/>
        </Switch>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
