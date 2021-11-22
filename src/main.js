import 'core-js/es/map';
import 'core-js/es/set';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import App from './components/App';
import runSetup from './setup';

import configureStore from './store';

const historyInstance = createBrowserHistory();

// Initialisiere den Store
const store = configureStore({}, historyInstance);

// wrap react-dom rendering
const render = AppComponent => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <AppComponent history={historyInstance} />
            </Provider>
        </AppContainer>,
        document.getElementById('app'),
    );
};

// initial setup
runSetup(store.dispatch).then(() => {
    const root = document.getElementById('app');
    if (root) {
        render(App);
    }

    if (module.hot && process.env.NODE_ENV !== 'production') {
        // enable HMR updates
        module.hot.accept('./components/App', () => {
            // eslint-disable-next-line  global-require
            const NextApp = require('./components/App').default;
            render(NextApp);
        });
    }
});
