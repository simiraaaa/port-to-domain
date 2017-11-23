const {
  nginx_servers_dir,
  nginx_server_settings,
  hosts,
  servers,
} = require('./settings.json');
const HOSTS_COMMENT = '## setting by port-to-domain.js';
const fs = require('fs');

function buildServerSettings(server) {
  const locationText = Object.keys(nginx_server_settings.location).map(key => {
    var text = nginx_server_settings.location[key];
    for (let target in server) {
      text = text.replace(`$${target}`, server[target]);
    }
    return `        ${key}: ${text};`
  }).join('\n');
  return `server {
    listen: ${nginx_server_settings.listen};
    server_name: ${server.app};
    location / {
${locationText}
    }
}
`;
}

const hostsText = fs.readFileSync(hosts).toString().split('\n');
const index = hostsText.indexOf(HOSTS_COMMENT);

if (index === -1) {
  hostsText.push(HOSTS_COMMENT);
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
  fs.writeFileSync(`${nginx_servers_dir}/${app}.conf`, buildServerSettings({
    app,
    port,
    dir,
    address,
    protocol,
  }));
  hostsText.push(`${address}\t${app}`);
}

fs.writeFileSync(hosts, hostsText.join('\n'));