/**
 * @module middlewares/assets
 *
 * @author Rory Malone <rory.malone@arm.com>
 */
import {IAssetMiddlewareConfig, IAssetsObject, IHashedAssetMetaData} from './models';
import {NextFunction, Request, Response} from 'express';
import path from "path";
import fs from "fs";
import debug0 from "debug";

const debug = debug0('app:middlewares:assets');

const DEFAULT_OPTIONS: Partial<IAssetMiddlewareConfig> = {
    fallback: {
        css: ['main.css'],
        js: ['main.tsx']
    },
    hashedAssetsInfoFilename: '.assetinfo',
    hashedAssetsDir: path.join(process.cwd(), 'public'),
};

const assetEndsWith = (str: string) => (source: string) => source.split('?')[0].endsWith(str); // removing possible version query param before testing

/**
 * Simplify the asset metadata to arrays of file paths
 *
 * @author Rory Malone <rory.malone@arm.com>
 */
const buildAssetsObjFromAssetInfo = (hashedAssets: IHashedAssetMetaData): IAssetsObject => {
    const {assets} = hashedAssets.entrypoints.main;

    return {
        css: assets.filter(assetEndsWith('.css')),
        js: assets.filter(assetEndsWith('.js'))
    };
};

/**
 * Read the asset info file that has the hashed file paths
 *
 * @author Rory Malone <rory.malone@arm.com>
 */
const loadAssetInfo = ({
                           webpackCompiler,
                           hashedAssetsDir,
                           hashedAssetsInfoFilename
                       }: IAssetMiddlewareConfig, cb: (err: any, info?: IHashedAssetMetaData) => void) => {
    const fileSystem = webpackCompiler ? webpackCompiler.outputFileSystem : fs;
    const assetsLocation = webpackCompiler.outputPath;
    const assetsPath = path.join(assetsLocation, hashedAssetsInfoFilename);

    // @ts-ignore
    fileSystem.readFile(assetsPath, (err: any, buffer: Buffer): void => {
        if (err) {
            debug('Failed to read assetinfo');
            return void cb(err);
        }

        try {
            cb(null, JSON.parse(buffer.toString()));
        } catch (JSONErr) {
            cb(JSONErr);
        }
    });
};

/**
 * Sets up a middleware to serve the built (by webpack) client files
 *
 * @author Rory Malone <rory.malone@arm.com>
 */
export default function assets(options = Object.create(null)) {
    const config = Object.assign(Object.create(null), DEFAULT_OPTIONS, options);
    let cachedAssets: IAssetsObject = null;

    const getAssets = (cb: (err: any, assetsObj?: IAssetsObject) => void): void => {
        if (cachedAssets === null) {
            return void loadAssetInfo(config, (err: any, assetInfo: IHashedAssetMetaData) => {
                if (err) {
                    debug('Could not load build stats file. Maybe build script hasn\' been run?');

                    if (config.fallback) {
                        debug('loading fallback assets entrypoints: ', config.fallback);

                        cb(null, config.fallback);
                    } else {
                        debug(err);

                        cb(new Error(`Could not load build stats and no fallbacks provided, cannot render assets. (${err.message})`));
                    }

                    return;
                }

                cachedAssets = buildAssetsObjFromAssetInfo(assetInfo);

                debug('loading assets entrypoints from build stats:', cachedAssets);

                cb(null, cachedAssets);
            });
        }

        debug('Loading cached assets entrypoints', cachedAssets);

        cb(null, cachedAssets);
    }

    /**
     * The middleware that will serve any static built file
     * Add built file paths to res.locals to render from pug file
     *
     * @author Rory Malone <rory.malone@arm.com>
     */
    const assetsMiddleware = (req: Request, res: Response, next: NextFunction) => {
        getAssets((err: any, assetsObj: IAssetsObject) => {
            if (err) {
                debug('Failed.');
                void next(err);
            }

            res.locals.assets = assetsObj;

            next();
        });
    }

    /**
     * Notifies the middleware that the assets have changed so it can reload them
     *
     * @author Rory Malone <rory.malone@arm.com>
     */
    assetsMiddleware.hashedAssetsUpdated = function hashedAssetsUpdated(): void {
        debug('Received notification that build stats has been updated. Clearing assets cache');

        cachedAssets = null;
    };

    debug('Creating assets middleware');

    return assetsMiddleware;
};
