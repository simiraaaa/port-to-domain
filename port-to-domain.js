const {
  nginx_servers_dir,
  nginx_server_settings,
  nginx_restart_command,
  hosts,
  servers,
} = require('./settings.json');
const COMMENT = '## setting by port-to-domain.js';
const fs = require('fs');

function buildServerSettings(server) {
  const locationText = Object.keys(nginx_server_settings.location).map(key => {
    var text = nginx_server_settings.location[key];
    for (let target in server) {
      text = text.replace(`$${target}`, server[target]);
    }
    return `        ${key} ${text};`
  }).join('\n');
  return [
    COMMENT,
    'server {',
    `    listen ${nginx_server_settings.listen};`,
    `    server_name ${server.app};`,
    '    location / {',
    locationText,
    '    }',
    '}'
  ].join('\n');
}

const hostsText = fs.readFileSync(hosts).toString().split('\n');

// backup
fs.writeFileSync(__dirname + '/hosts.backup', hostsText.join('\n'));
const index = hostsText.indexOf(COMMENT);

if (index === -1) {
  hostsText.push(COMMENT);
}
else {
  hostsText.splice(index + 1);
}

for (let app in servers) {
  const {
    port = 3000,
    dir = '',
    address = '127.0.0.1',
    protocol = 'http',
  } = servers[app];
  const serverPath = `${nginx_servers_dir}/${app}.conf`;
  if (fs.existsSync(serverPath) && fs.readFileSync(serverPath).toString().split('\n')[0] === COMMENT) {
    fs.unlinkSync(serverPath);
  }
  fs.writeFileSync(serverPath, buildServerSettings({
    app,
    port,
    dir,
    address,
    protocol,
  }));
  hostsText.push(`${address}\t${app}`);
}

fs.writeFileSync(hosts, hostsText.join('\n'));
require('child_process').execSync(nginx_restart_command);