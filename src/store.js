import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';

import appReducer from './modules/app';

/* eslint-disable no-underscore-dangle */
export default function configureStore(initialState, history) {
    const reducers = combineReducers({
        app: appReducer,
    });
    let composeEnhancers = compose;

    // noinspection JSUnresolvedVariable
    // eslint-disable-next-line  no-underscore-dangle
    if (
        process.env.NODE_ENV === 'development'
        && typeof window !== 'undefined'
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ) {
        // eslint-disable-next-line  no-underscore-dangle
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }

    return createStore(
        reducers,
        initialState,
        composeEnhancers(applyMiddleware(ReduxThunk)),
    );
}
/* eslint-enable */
