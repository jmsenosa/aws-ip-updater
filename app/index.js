 var AWSSGIngress = require('./AWSSGIngress');

// 120.29.112.224/32 

var sgID = 'sg-bf6f40c7';
var ip = require('whatismyip');
var options = {
  url: 'http://checkip.dyndns.org/',
  truncate: '',
  timeout: 60000,
  matchIndex: 0
};


ip.whatismyip(options, (err, ipdata) => {
  if (err === null) { 
 
    var AWSSecurityGroupIngress = new AWSSGIngress(ipdata.ip, sgID);

    AWSSecurityGroupIngress.getSecurityGroups();
  }
});