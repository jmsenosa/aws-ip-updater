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
 

  getSecurityGroups () {

    return new Promise((resolve, reject) => {
      this.ec2.describeSecurityGroups({
        GroupIds: this.sgID
      }, (err, data) => {
  
        if (err === null) {
          resolve(data);
        } else { 
          reject(err);
        }
      });
    });
    
  }
  
  authSecurityGroupIngress (IpPermission) {
    return new Promise((resolve, reject) => {
      this.ec2.authorizeSecurityGroupIngress({ 
        GroupIds: this.sgID,
        IpPermissions: IpPermission
      }, (err, data) => {
        if (err === null) {
          resolve(data);
        } else { 
          reject(err);
        }
      });
    });
  }

  revokeSecurityGroupIngress (IpPermission) {
    return new Promise((resolve, reject) => {
      
      if (IpPermission == "") {
        reject("IpPermission is blank!");
      }

      var param = {
        GroupIds: this.sgID,
        IpPermissions: IpPermission
      }; 

      this.ec2.revokeSecurityGroupIngress(param, (err, data) => { 
        if (err === null) {
          resolve(data);
        } else { 
          reject(err);
        }
      });
    });
  }


} 

module.exports = AWSSGIngress;

// module.exports = AWSSGIngress;