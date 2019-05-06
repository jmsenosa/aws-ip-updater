var AWSSGIngress = require('./AWSSGIngress');
var async = require('async');
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

async.waterfall([
  // get ip address
  (cb) => {
    ip.whatismyip(options, (err, ipdata) => {
      if (err === null) { 
        cb(null, ipdata);
      } else {
        cb(err);
      }
    });
  }, 
  // get security groups 
  (ipdata, cb) => {
    var awsSGI = new AWSSGIngress(ipdata.ip, sgID);
    awsSGI.getSecurityGroups()
    .then((data) => {
      return cb(null, awsSGI, ipdata, data);
    })
    .catch((err) => {
      // console.log();
      return cb(err);
    });
  }, 
  // filter security group by security group id and ip label
  (awsSGI, ipdata, data, cb) => {
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
                iprangePermssion[0].IpRanges.push(iprange);
                // console.log(iprangePermssion);
                return iprange;
              }
            });  
          }
        });
      }
    });

    cb(null, ipdata, awsSGI, iprangePermssion); 
    
  }, 
  // revoke ip address ingress in a security group
  (ipdata, awsSGI, iprangePermssion, cb) => {
    let newValue = {
      CidrIp: ipdata.ip+"/32",
      Description: sgIPLabel
    }; 

    if (iprangePermssion[0].IpRanges.length > 0) {
      awsSGI.revokeSecurityGroupIngress(iprangePermssion)
      .then((data) => {

        console.log("Revoked \n", iprangePermssion[0].IpRanges, "\n"); 

        let iprange = [];
        iprange.push(newValue);
        iprangePermssion[0].IpRanges = iprange;
        
        cb(null, awsSGI, iprangePermssion, ipdata);
      });
    } else { 
      iprangePermssion[0].IpRanges.push(newValue);
      cb(null, awsSGI, iprangePermssion, ipdata);
    }
  }, 
  // add security group id
  (awsSGI, iprangePermssion, ipdata, cb) => {
    awsSGI.authSecurityGroupIngress(iprangePermssion)
    .then((data) => {  
      cb(null, "IP Address "+ipdata.ip+" is added to "+sgID+"\n");
    }).catch((err) => {
      cb(err);
    }); 
  }
], (err, result) => {
  if (err === null) {
    console.log(result);
  } else {
    console.log(err);
  }
});

