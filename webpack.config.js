import path from 'path';
import webpack from 'webpack';
import clearConsole from 'console-clear';
import chalk from 'chalk';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

// import BundleAnalyzerPlugin from 'webpack-bundle-analyzer/lib/BundleAnalyzerPlugin.js';

const DonePlugin = class donePlugin {
    constructor(localUrl, networkUrl) {
        this.localUrl = localUrl;
        this.networkUrl = networkUrl;
    }

    apply(compiler) {
        const doneHook = stats => {
            clearConsole();
            if (stats.hasErrors()) {
                console.log(chalk.red('Build failed!'));
            } else {
                console.log(chalk.green('Compiled successfully!'));
                console.log(`Local:            ${this.localUrl}`);
                console.log(`On Your Network:  ${this.networkUrl}`);
                console.log();
                console.log();
            }
        };
        if (compiler.hooks) {
            compiler.hooks.done.tap('donePlugin', doneHook);
        } else {
            compiler.plugin('done', doneHook);
        }
    }
};

const options = {
    title: 'Example',
    ROOT_DIR: './',
    SRC_DIR: './src/',
    ASSETS_DIR2: 'assets/enummer',
    ASSETS_DIR: './assets/enummer/',
    BUILD_DIR: './build/',
    DIST_DIR: './dist/',
    DMW_PATH: 'D:/development/dmw-enummer-bundle/htdocs/assets/enummer/',
    DMW_ASSETS_PATH: 'D:/development/dmw-enummer-bundle/htdocs/assets/enummer/',
    CACHE_DIR: './cache/',
    entryFiles: ['index'],
    jsOutputFile: '[name].bundle.js',
    cssOutputFile: 'style.css',
    cssChunkFile: '[id].css',
    htmlTemplate: 'index.html',
    APP_NAME: 'DMW Portal',
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000,
    browsersList: [
        '>2.5%',
        'last 4 chrome versions',
        'last 4 ff versions',
        'last 2 edge versions',
        'last 2 ios versions',
        'last 2 safari versions',
        'not ie 11',
    ],
};

const URL = `http://${options.host}:${options.port}`;
const devServerEntries = [
    `webpack-dev-server/client?${URL}`,
    'webpack/hot/dev-server'
];

const webpackConfig = (DEV_MODE, data = {}) => ({
    mode: (DEV_MODE ? 'development' : 'production'), // Webpack 4+
    entry: {
        main: (DEV_MODE
            ? devServerEntries
            : [])
            .concat([
                // '@babel/polyfill',
                `${options.SRC_DIR}styles/main.scss`,
                `${options.SRC_DIR}main.js`
            ])
    },
    output: (DEV_MODE
        ? {
            path: path.resolve(options.DIST_DIR),
            publicPath: '',
            filename: '[name].bundle.js',
            sourceMapFilename: '[file].map',
            chunkLoading: false,
            // library: {
            //     type: 'module'
            // }
        } : {
            path: path.resolve(options.BUILD_DIR),
            publicPath: '',
            filename: '[name].bundle.js',
        }
    ),
    performance: {
        hints: false,
    },
    target: 'web',

    devtool: DEV_MODE
        ? 'cheap-module-source-map'
        : 'nosources-source-map',

    stats: {
        hash: false,
        timings: false,
        // chunks: false,
        chunkModules: false,
        modules: true,
        children: false,
    },

    module: DEV_MODE ? {
        rules: [ // Development
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                'transform-react-remove-prop-types'
                            ],
                            presets: [
                                ['@babel/preset-env',
                                    {
                                        modules: false,
                                        targets: {
                                        },
                                    }
                                ],
                                '@babel/preset-react'
                            ],
                        },
                    },
                ],
                exclude: /node_modules/,
                include: path.resolve(options.SRC_DIR),
            },
            {
                test: /\.(scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: {
                                localIdentName: '[local]',
                            },
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                modules: true,
                                localIdentName: '[local]',
                                url: false,
                                plugins: [
                                    'postcss-preset-env'
                                ],
                            },
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [path.resolve(options.SRC_DIR, 'styles')]
                            }
                        }
                    }
                ],

                exclude: /components/
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true,
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                            },
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                modules: true,
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                                url: false,
                                plugins: [
                                    'postcss-preset-env'
                                ],
                            },
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [path.resolve(options.SRC_DIR, 'styles')]
                            }
                        }
                    }
                ],
                exclude: /styles/,
                include: path.resolve(options.SRC_DIR),
            },
            {
                test: /\.(css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                            },
                            url: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                plugins: [
                                    'postcss-preset-env'
                                ],
                            },
                        },
                    },
                ],
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [{ loader: 'json-loader' }],
            },
            {
                test: /\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: -1,
                            name: path.resolve(
                                options.SRC_DIR,
                                options.ASSETS_DIR2,
                                '/_processed_/[name].[hash:5].[ext]',
                            ),
                        },
                    },
                ],
            },
        ]
    } : { // Production
        // ####################################################################################################
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                [
                                    '@babel/plugin-transform-runtime',
                                    {
                                        corejs: false,
                                        helpers: true,
                                        regenerator: true,
                                        useESModules: true
                                    }
                                ],
                                'transform-react-remove-prop-types',
                                ['@babel/plugin-proposal-class-properties', { loose: false }]
                            ],
                            presets: [['@babel/preset-env', {
                                modules: false,
                                targets: {
                                    browsers: 'last 2 versions'
                                },
                                loose: false,
                            }],
                            '@babel/preset-react'],
                        },
                    },
                ],
                exclude: /node_modules/,
                include: path.resolve(options.SRC_DIR),
            },
            {
                test: /\.(scss)$/,
                use: [
                    // {
                    //     loader: 'style-loader',
                    // },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            modules: {
                                localIdentName: '[local]',
                            },
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            postcssOptions: {
                                modules: true,
                                localIdentName: '[local]',
                                url: false,
                                plugins: [
                                    'postcss-preset-env'
                                ],
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            sassOptions: {
                                includePaths: [path.resolve(options.SRC_DIR, 'styles')]
                            }
                        }
                    }
                ],
                exclude: /components/
            },

            {
                test: /\.(scss)$/,
                use: [
                    // {
                    //     loader: 'style-loader',
                    // },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                            },
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false,
                            postcssOptions: {
                                modules: true,
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                                url: false,
                                plugins: [
                                    'postcss-preset-env'
                                ],
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            sassOptions: {
                                includePaths: [path.resolve(options.SRC_DIR, 'styles')]
                            }
                        }
                    }
                ],
                exclude: /styles/,
                include: path.resolve(options.SRC_DIR),
            },
            {
                test: /\.(css)$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                            },
                            url: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                plugins: [
                                    'postcss-preset-env'
                                ],
                            },
                        },
                    },
                ],
                exclude: /components/
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [{ loader: 'json-loader' }],
            },
            {
                test: /\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: -1,
                            name: path.resolve(
                                options.SRC_DIR,
                                options.ASSETS_DIR2,
                                '/_processed_/[name].[hash:5].[ext]',
                            ),
                        },
                    },
                ],
            },
        ]
    },
    plugins: (DEV_MODE
        ? [
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false),
                process: {
                    env: {
                        NODE_ENV: JSON.stringify('development'),
                        DEBUG: JSON.stringify(true),
                    },
                },
            }),
            new CleanWebpackPlugin({}),
            new HtmlWebpackPlugin({
                title: options.title,
                template: path.resolve(options.SRC_DIR, 'index.html'),
                filename: 'index.html',
                hash: false,
                inject: true,
                compile: true,
                favicon: false,
                minify: false,
                cache: true,
                showErrors: true,
                chunks: 'all',
                excludeChunks: [],
                chunksSortMode: 'auto',
                meta: {},
                xhtml: false,
            }),
            new MiniCssExtractPlugin(),
            new DonePlugin(data.localUrl, data.networkUrl),
            new ESLintPlugin({
                cache: false,
                eslintPath: require.resolve('eslint'),
                useEslintrc: true,
            }),

            // new BundleAnalyzerPlugin(),
        ]
        : [ // Production
            // new ExtractTextPlugin({
            //     filename: 'style.css',
            //     disable: false,
            //     allChunks: false,
            // }),
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true),
                NODE_ENV: JSON.stringify('production'),
                process: {
                    env: {
                        NODE_ENV: JSON.stringify('production'),
                        DEBUG: JSON.stringify(false),
                    },
                },
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(options.ASSETS_DIR),
                        to: path.resolve(options.BUILD_DIR, options.ASSETS_DIR2),
                    },
                ],
            }),
            new CleanWebpackPlugin({}),
            new HtmlWebpackPlugin({
                title: options.title,
                template: path.resolve(options.SRC_DIR, 'index.html'),
                filename: 'index.html',
                hash: false,
                inject: true,
                compile: true,
                favicon: false,
                minify: true,
                cache: true,
                showErrors: true,
                chunks: 'all',
                excludeChunks: [],
                chunksSortMode: 'auto',
                meta: {},
                xhtml: false,
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            }),
            new UglifyJsPlugin({ sourceMap: false, uglifyOptions: { minimize: true, sourceMap: false } }),
        ]),
    optimization: {
        minimize: (!DEV_MODE),
        minimizer: (DEV_MODE
            ? []
            : [
                new CssMinimizerPlugin(),
            ]),
    },
    resolve: {
        symlinks: false,
        alias: {
            'react-dom': DEV_MODE ? '@hot-loader/react-dom' : 'react-dom',
        },
        modules: [
            'node_modules',
            path.resolve(options.SRC_DIR, 'node_modules'),
            path.resolve(options.ROOT_DIR, 'node_modules'),
        ],
        extensions: ['.mjs', '.js', '.json', '.scss'],
    },
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(options.SRC_DIR, 'node_modules'),
            path.resolve(options.ROOT_DIR, 'node_modules'),
        ],
    },
    experiments: {
        outputModule: true,
    },
});

export {
    webpackConfig,
    options,
    URL,
};
