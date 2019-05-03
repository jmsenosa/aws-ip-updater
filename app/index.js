 var AWSSGIngress = require('./AWSSGIngress');

// 120.29.112.224/32 

var sgID = 'sg-bf6f40c7';
var sgIPLabel = "HKZ Office";


var ip = require('whatismyip');
var options = {
  url: 'http://checkip.dyndns.org/',
  truncate: '',
  timeout: 60000,
  matchIndex: 0
};


ip.whatismyip(options, (err, ipdata) => {
  if (err === null) { 
 
    var awsSGI = new AWSSGIngress(ipdata.ip, sgID);
    awsSGI.getSecurityGroups()
    .then((data) => {
      var iprangePermssion = [
        {
          FromPort: 22, 
          IpProtocol: "tcp", 
          IpRanges: [],
          ToPort: 22
        }
      ];

      data.SecurityGroups.filter((securityGroup) => {
        // console.log(securityGroup);
        if (securityGroup.GroupId == sgID) {
          return securityGroup.IpPermissions.filter((ip, i) => {
            if (ip.FromPort == 22) {
              var ipp = ip.IpRanges.filter((iprange, int) => {
                if (iprange.Description == sgIPLabel) {
                  iprangePermssion.IpRanges = iprange;
                  return iprange;
                }
              });  
            }
          });
        }
      });
      
      awsSGI.revokeSecurityGroupIngress(iprangePermssion)
      .then((data) => {
        
      });

    })
    .catch((err) => {
      console.log(err);
    }); 
  }
});