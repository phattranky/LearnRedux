import React from 'react';
import { render } from 'react-dom';

import css from './styles/style.styl';

import App from './components/App';
import Single from './components/Single';
import PhotoGrid from './components/PhotoGrid';
import AreaLineChart from './components/chart/AreaLineChart';

// import react router deps
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import store, { history } from './store';

const router = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={PhotoGrid}></IndexRoute>
                <Route path="/view/:postId" component={Single}></Route>
                <Route path="/arealinechart" component={AreaLineChart}></Route>
            </Route>
        </Router>
    </Provider>
)

//render(<Main><p>Hello Children of Main</p></Main>, document.getElementById('root'));
render(router, document.getElementById('root'));