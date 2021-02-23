import React from 'react';
import './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import css from './App.module.css';

import MyHeader from "./component/my-header/my-header"
import MyFooter from "./component/my-footer/my-footer";
import MainContent from "./component/main-content/main-content";
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import SeancesForAllMovieParks from "./component/seances/seances-for-all-movie-parks/seances-for-all-movie-parks";
import {SeanceSchema} from "./component/seances/seance-schema/seance-schema";
import GeneralUtils from "./scripts/general-utils";
import Payment from "./component/seances/payment/payment";
import PaymentSuccess from "./component/seances/payment/payment-success";

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
