const { servers } = require('./settings.json');
console.log(servers[process.argv[2]].port);