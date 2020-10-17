//import dotenv from 'dotenv'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import AzureAuthCallback from './views/azure_auth_callback';
import Main from './views/main/Main';
import Landing from './views/landing';
import Store from './store/store'

const store = new Store();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/azure-auth-callback">
          <AzureAuthCallback store={store}/>
        </Route>
        <Route path="/app">
          <Main store={store}/>
        </Route>
        <Route path="/">
          <Landing/>
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
