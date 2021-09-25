import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Footer from "./footer"
import Bicicletas from "./views/Bicicletas"
import Header from './header';
import Home from './views/Home';
import Alquiler from './views/Alquiler'


const routing = (
  <HashRouter>
    <div>
      <Header />
      <div className="content">
        <Route exact path="/" component={App} />
        <Route path="/views/bicicletas" component={Bicicletas} />
        <Route path="/views/alquiler" component={Alquiler} />
        <Route path="/views/home" component={Home} />
      </div>
      <Footer />
    </div>
  </HashRouter>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
