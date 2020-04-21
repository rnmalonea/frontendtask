import {Compiler} from 'webpack';

export interface IAssetMiddlewareConfig {
    webpackCompiler: Compiler,
    fallback: {
        css: string[],
        js: string[]
    },
    hashedAssetsInfoFilename: string,
    hashedAssetsDir: string,
}

export interface IHashedAssetMetaData {
    entrypoints: {
        main: {
            assets: string[]
        }
    }
}

export interface IAssetsObject {
    js: string[],
    css: string[]
}
