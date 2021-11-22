import setApplicationModeAction from './actions';

// STORE
const appStore = {
    applicationmode: null,
};

export default function appReducer(state = appStore, action = {}) {
    switch (action.type) {
        case `${setApplicationModeAction}`: {
            return {
                ...state,
                applicationmode: action.payload.mode,
            };
        }

        default: {
            return state;
        }
    }
}
