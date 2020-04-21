const webpack = require('webpack');
const project = require('./project.config');
const HashedAssetPlugin = require('../lib/plugins');

const APP_ENTRY = project.paths.client('main.tsx');
const APP_PUBLIC_PATH = project.client.basePath;

const CSS_LOADER = {
    loader: 'css-loader',
    options: {
        sourceMap: project.build.sourceMap,
        importLoaders: 1
    }
};

const POSTCSS_LOADER = {
    loader: 'postcss-loader',
    options: {
        sourceMap: project.build.sourceMap,
        plugins: () => [
            require('cssnano')({
                autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: project.client.supportedBrowsers
                },
                discardComments: {
                    removeAll: true
                },
                discardUnused: false,
                mergeIdents: false,
                reduceIdents: false,
                safe: true,
                sourcemap: project.build.sourceMap
            })
        ]
    }
};

const SASS_LOADER = {
    loader: 'sass-loader',
    options: {
        sourceMap: project.build.sourceMap,
        sassOptions: {
            includePaths: [
                project.paths.client('styles')
            ]
        }
    }
};

/**
 * @author Rory Malone <rory.malone@arm.com>
 */
module.exports = {
    devtool: 'eval',
    mode: 'development',
    target: 'web',
    entry: [
        '@babel/polyfill',
        'react-hot-loader/patch',
        `webpack-hot-middleware/client?path=${APP_PUBLIC_PATH}__hot_reload&reload=true`,
        APP_ENTRY
    ],
    output: {
        filename: 'js/[name].[hash].js',
        path: project.paths.public(),
        publicPath: APP_PUBLIC_PATH
    },

    resolve: {
        modules: [
            'node_modules',
            project.paths.base()
        ],
        extensions: ['.tsx', '.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    CSS_LOADER,
                    POSTCSS_LOADER,
                    'resolve-url-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    CSS_LOADER,
                    POSTCSS_LOADER,
                    'resolve-url-loader',
                    SASS_LOADER
                ]
            },
            {
                test: /\.woff(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        limit: 10000,
                        mimetype: 'application/font-woff'
                    }
                }
            },
            {
                test: /\.woff2(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        limit: 10000,
                        mimetype: 'application/font-woff2'
                    }
                }
            },
            {
                test: /\.otf(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.ttf(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        limit: 10000,
                        mimetype: 'application/octet-stream'
                    }
                }
            },
            {
                test: /\.eot(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            {
                test: /\.svg(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name].[ext]',
                        limit: 10000,
                        mimetype: 'image/svg+xml'
                    }
                }
            },
            {
                test: /\.(png|jpg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'images/[name].[ext]',
                        limit: 10000
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HashedAssetPlugin.default()
    ]
};
