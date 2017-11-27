const app = process.argv[2];

if (!app) {
  let servers = require('./settings.json').servers;
  for (let k in servers) {
    if (servers.envdir === __dirname) {
      app = k;
    }
  }
}

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
  process.stdout.write(data.toString());
});

log.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

log.on('close', (code) => {
  process.stdout.write(`exit ${app} ${code}`);
});