import opn from 'opn';
import path from 'path';
import del from 'del';
import gulp from 'gulp';
import webpack from 'webpack';
import getPort from 'get-port';
import chalk from 'chalk';
import ip from 'ip';
import WebpackDevServer from 'webpack-dev-server';
import log from 'fancy-log';
import gulpLoadPlugins from 'gulp-load-plugins';
import { webpackConfig, options, URL } from './webpack.config.js';

const $ = gulpLoadPlugins({ camelize: true });

const open = () => opn(URL);

const buildClean1 = () => del([options.BUILD_DIR]);

// Copy static files
const assetsSyncCopy = () => gulp.src(`${options.ROOT_DIR}${options.ASSETS_DIR2}/**/*`)
    .pipe(gulp.dest(`${options.BUILD_DIR}${options.ASSETS_DIR2}/`));

// Copy index.html and inject js bundle for dev server
// noinspection JSUnresolvedVariable
const buildIndex = () => gulp
    .src(`${options.SRC_DIR}index.html`)
    .pipe($.injectString.after('<!-- inject:app:css -->', '<link href="main.css" rel="stylesheet" />'))
    .pipe($.injectString.after('<!-- inject:app:js -->', '<script src="main.bundle.js"></script>'))
    .pipe(gulp.dest(options.BUILD_DIR));

const start = async () => {
    const { host, port: preferredPort } = options;

    const portRange = getPort.makeRange(preferredPort, preferredPort + 10);
    const port = await getPort({ host, port: portRange });

    const localUrl = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`;
    const networkUrl = `http://${ip.address()}:${port}`;

    const compiler = webpack(webpackConfig(true, { localUrl, networkUrl }));

    return new WebpackDevServer({
        host: options.host,
        port: options.port,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        },
        static: {
            directory: path.resolve(options.BUILD_DIR), // Old contentBase
        },
        devMiddleware: {
            stats: {
                colors: true,
                hash: false,
                timings: false,
                // chunks: false,
                chunkModules: false,
                modules: false,
                children: false,
            },
        },
        hot: true,
        client: false,
        historyApiFallback: true,
    }, compiler).startCallback((err) => {
        if (err) { // noinspection JSUnresolvedVariable
            throw new $.util.PluginError('webpack-dev-server', err);
        }
        // Server listening
        // noinspection JSUnresolvedVariable
        log(`[webpack-dev-server]: ${URL}`);
    });
};

const build = async () => {
    const { host, port: preferredPort } = options;

    const compiler = webpack(webpackConfig(false));
    compiler.run((err, stats) => {
        const statsPool = {
            colors: true,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: false,
        };

        if (err || stats.hasErrors()) {
            console.log(chalk.red('Build failed!'));
            console.log();
            console.log('[webpack]', stats.toString(statsPool));
            process.exit(1);
        }

        console.log(chalk.green('Compiled successfully!'));
        console.log();
        console.log('[webpack]', stats.toString(statsPool));
    });
};

// Primary tasks
gulp.task('dev', gulp.series(assetsSyncCopy, gulp.parallel(start), open));

gulp.task('build', gulp.series(buildClean1, assetsSyncCopy, buildIndex, gulp.parallel(build)));
