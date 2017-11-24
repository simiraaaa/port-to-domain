const app = process.argv[2];
const server = require('./settings.json').servers[app];

if (!server) {
  console.error(`${app} not found`);
  process.exit(4);
}

if (!server.command) {
  console.error(`command not found`);
  console.error(`please addcommand`);
  console.error(`node addcommand.js ${app} "server start command" [command running directory (default: current directory)] `);

  process.exit(1);
}

const log = require('child_process').spawn('sh', ['-c', `cd ${server.envdir}; ${server.command.replace(/\{PORT\}/g, server.port)}`]);


log.stdout.on('data', (data) => {
  console.log(data.toString());
});

log.stderr.on('data', (data) => {
  console.error(data.toString());
});

log.on('close', (code) => {
  console.log(`exit ${app} ${code}`);
});