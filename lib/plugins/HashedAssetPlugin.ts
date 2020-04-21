import {Compiler, Stats} from 'webpack';

const path = require('path');

interface IHashedAssetPluginOptions {
    filename: string,
    ignoreStats: string[]
}

/**
 * Plugin to generate info file so that the portal server can use it when rendering hashed assets
 *
 * @see https://webpack.js.org/concepts/plugins/
 *
 * @author Rory Malone <rory.malone@arm.com>
 */
export default class HashedAssetPlugin {
    options: IHashedAssetPluginOptions;

    constructor(options: Partial<IHashedAssetPluginOptions> = {}) {
        this.options = {
            filename: '.assetinfo',
            ignoreStats: ['assets', 'modules', 'children'],
            ...options
        }
    }

    /**
     * method Webpack calls on plugins
     *
     * @author Rory Malone <rory.malone@arm.com>
     */
    apply(compiler: Compiler) {
        compiler.hooks.done.tap('HashedAssetPlugin', (stats: Stats) => {
            const statsJson: any = stats.toJson();
            const simpleStats = Object
                .keys(statsJson)
                .filter((statKey: string) => !this.options.ignoreStats.includes(statKey))
                .reduce((res: { [key: string]: string }, statKey: string) => ({
                    ...res,
                    [statKey]: statsJson[statKey]
                }), Object.create(null));

            compiler.outputFileSystem.writeFile(
                path.join(compiler.outputPath, this.options.filename),
                JSON.stringify(simpleStats, null, 2),
                (err: any) => {
                    if (err) {
                        console.error('Could not write asset stats:', err);
                    } else {
                        console.log('Asset stats written');
                    }
                }
            );
        });
    }
}
