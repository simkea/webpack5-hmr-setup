import setApplicationModeAction from './modules/actions';

export const setUpApplicationMode = (dispatch, getState) => {
    const mode = process.env.NODE_ENV;
    const debug = process.env.DEBUG;
    dispatch({ type: `${setApplicationModeAction}`, payload: { mode, debug } });
};

/**
 * Runs all setup scripts in a defined order and returns a Promise.
 * @param {Function} dispatch
 * @returns {Promise}
 */
export default function runSetup(dispatch) {
    // set up scripts that should always run
    const batch = [setUpApplicationMode]; // initLoadPersonData setUpI18n

    // run all scripts asynchronously
    return Promise.all(
        batch.map(
            fn => new Promise(resolve => {
                // eslint-disable-next-line  no-console
                console.info(`[SETUP] Running ${fn.name} ...`);
                dispatch(fn);
                resolve();
            }),
        ),
    );
}
