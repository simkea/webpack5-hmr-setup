window.onunhandledrejection = e => {
    console.warn('Unhandled Promise Rejection', e.reason);
    if (window.Raven) {
        window.Raven.captureException(e.reason, {
            extra: { unhandledPromise: true },
        });
    }
};

if (window.Promise) {
    console.debug(
        'This browser provides a native Promise. I\'m disabling it to force use of core-js to allow "onunhandledrejection".',
    );
    delete window.Promise;
}
