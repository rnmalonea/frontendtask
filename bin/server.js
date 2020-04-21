const debug = require('debug')('app:bin:server');
const project = require('../config/project.config');
const server = require('../dist/server/main');

server.listen(project.server.port);

debug(`server is now running at http://${project.server.host}:${project.server.port}.`);
