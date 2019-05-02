let AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'}); 

class AWSSGIngress {
   
  // set ip address 
  constructor (ipAddress, sgID) {

    this.ipAddress = ipAddress;
    this.ipAddressCIDR = ipAddress+"/32";
    this.sgID = [];
    this.sgID.push(sgID);
    this.ec2 = new AWS.EC2(); 
  }

  getSecurityGroups() {
    this.ec2.describeSecurityGroups({
      GroupIds: this.sgID
    }, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log(data);
      }
    });
  }


} 

// module.exports = AWSSGIngress;

module.exports = AWSSGIngress;