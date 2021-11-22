const setApplicationModeAction = mode => ({
    type: `${setApplicationModeAction}`,
    payload: mode,
});

setApplicationModeAction.toString = () => 'SET_APPLICATION_MODE';

export default setApplicationModeAction;
