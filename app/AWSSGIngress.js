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
          // console.log(data);
          resolve(data);
        } else { 
          reject(err);
        }
      });
    });
    
  }
  
  authSecurityGroupIngress (IpPermission) {
    let params = { 
      GroupId: this.sgID[0],
      IpPermissions: IpPermission
    }; 
    return new Promise((resolve, reject) => {
      this.ec2.authorizeSecurityGroupIngress(params, (err, data) => {
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
        GroupId: this.sgID[0],
        IpPermissions: IpPermission
      }; 

      // console.log("params: ",param);

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