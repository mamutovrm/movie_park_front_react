import React from 'react';
import './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from './App.module.css';
import constants from "./scripts/constants";

import MyHeader from "./component/Header/MyHeader"
import MyFooter from "./component/Footer/MyFooter";
import MainContent from "./component/MainContent/MainContent";
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import SeancesForAllMovieParks from "./component/Seances/SeancesForAllMovieParks/SeancesForAllMovieParks";
import {SeanceSchema} from "./component/Seances/SeanceSchema/SeanceSchema";
import GeneralUtils from "./scripts/GeneralUtils";
import Payment from "./component/Seances/Payment/Payment";
import PaymentSuccess from "./component/Seances/Payment/PaymentSuccess";

function App() {
    return (
        <BrowserRouter>
            <div className={css.app_wrapper}>
                <MyHeader/>
                <Switch>
                    <Route path='/movies/active_date=:activeDate' component={MainContent}/>
                    <Route path='/seances/active_date=:activeDate/movie_id=:movieId' component={SeancesForAllMovieParks}/>
                    <Route path='/seance/seance_id=:seanceId' component={SeanceSchema}/>
                    <Route path='/seance/payment/success' component={PaymentSuccess}/>
                    <Route path='/seance/payment' component={Payment}/>
                    <Redirect from="/" to={`/movies/active_date=${GeneralUtils.todayDateStr()}`}/>
                </Switch>
                <MyFooter/>
            </div>
        </BrowserRouter>
    );
}

export default App;
