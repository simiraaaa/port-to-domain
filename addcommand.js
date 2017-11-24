const settings = require('./settings.json');

const app = process.argv[2];
const command = process.argv[3];
const envdir = process.argv[4]|| process.argv[1].replace(/[^/]*$/, '');

const server = settings.servers[app];
server.command = command;
server.envdir = envdir;

require('fs').writeFileSync(__dirname + '/settings.json', JSON.stringify(settings, null, '  '));