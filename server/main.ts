import express, {Request, Response} from 'express';
import cors from 'cors';
import compress from 'compression';
import _debug from 'debug';
import contractRouter from './routes/contracts'
import webpackConfig from '../config/webpack.config';
import webpack, {Configuration} from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import {assets} from "./middleware";

const webpackCompiler = webpack(webpackConfig as Configuration);
const debug = _debug('app:server:main');

let config = require('../config/project.config');
const app = express();

app.disable('etag');

app.set('views', config.paths.public());
app.set('view engine', 'pug');

Object.assign(app.locals, config.globals, config.server.templateLocals);

app.use(cors());
app.use(compress());

config = require('../config/project.config');

debug('Enabling webpack dev and hot reloading middleware.');

app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: config.client.basePath
}));

app.use(webpackHotMiddleware(webpackCompiler, {
    path: '/__hot_reload'
}));

const assetsMiddleware = assets({webpackCompiler});

webpackCompiler.hooks.done.tap('HashedAssetPlugin', assetsMiddleware.hashedAssetsUpdated);

app.use(assetsMiddleware);

app.use('/api/contracts', contractRouter);

app.use(express.static(config.paths.public()));

app.use('*', (req: Request, res: Response): void => void res.render('index'));

module.exports = app;
