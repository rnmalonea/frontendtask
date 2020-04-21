const debug = require('debug')('app:config:project');
const path = require('path');

debug('Creating default config.');
// ===================================================================
// Default Configuration
// ===================================================================
const config = {
    env: 'development',

    // -------------------------------------
    // Project dirs structure
    // -------------------------------------
    dirs: {
        config: __dirname.split(path.sep).pop(), // Current dir name
        client: 'client',
        public: 'public',
        server: 'server',
        resources: 'resources'
    },

    // -------------------------------------
    // Client configuration
    // -------------------------------------
    client: {
        // APP Base Path WITH leading AND ending slash
        basePath: process.env.BASE_PATH || '/',
        supportedBrowsers: ['> 1%', 'last 2 versions', 'not ie <=10', 'ie 11', 'Firefox ESR']
    },

    // -------------------------------------
    // Server configuration
    // -------------------------------------
    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,

        publicAddress: process.env.HOST || 'localhost',

        templateLocals: {
            title: 'Contract Hub'
        }
    },

    // -------------------------------------
    // Build configuration
    // -------------------------------------
    build: {
        sourceMap: true,
        hashType: 'hash'
    }
};

config.server.templateLocals.basePath = config.client.basePath;

// -------------------------------------
// Path utilities
// -------------------------------------
const basePath = path.resolve(__dirname, '../..');

function getPath(...args) {
    return path.resolve(basePath, ...args);
}

config.paths = {
    base: getPath,
    config: getPath.bind(null, config.dirs.config),
    client: getPath.bind(null, config.dirs.client),
    public: getPath.bind(null, config.dirs.public),
    server: getPath.bind(null, config.dirs.server),
    resources: getPath.bind(null, config.dirs.resources)
};

// -------------------------------------
// URL utilities
// -------------------------------------
function getUri(uri) {
    return uri.startsWith('/') ? uri.slice(1) : uri;
}

config.server.url = function url(uri = '/') {
    const {
        server: {secure, host, port},
        client: {basePath: clientBasePath}
    } = config;

    return `${secure ? 'https' : 'http'}://${host}:${port}${clientBasePath}${getUri(uri)}`;
};

config.server.publicUrl = function url(uri = '/') {
    const {server: {port, publicAddress, secure}} = config;

    return `${secure ? 'https' : 'http'}://${publicAddress}:${port}/${getUri(uri)}`;
};

module.exports = config;
