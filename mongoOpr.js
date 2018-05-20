module.exports = function(conn) {
  var accountCol = conn.collection('account');
  var invitationCol = conn.collection('invitation');
  var tableCol = conn.collection('table');
  var paramCol = conn.collection('param');

  return {
    newAccount : function(invitation, item) {
      return new Promise((resolve, reject) => {
        invitationCol.findOneAndDelete({invitation : invitation}).then(
          function (ret) {
            if (ret.lastErrorObject.n == 1) {
              accountCol.insertOne(item, function(err, r) {
                if (err) {
                  reject(err);
                } else {
                resolve(item);
                }
              })
            } else {
              reject("邀请码无效");
            }
          },function (err) {
            console.log("err");
            console.log(err);
            reject(err);
          }
        )
      })
    },    
    delAccount : function(account) {
      return accountCol.deleteOne({account : account});
    },      
    getAccount : function(account) {
      return accountCol.find({account : account}).toArray();
    },
  
    listAccount : function(start, num) {
      return accountCol.find({}).skip(start).limit(num).toArray();
    },   
    newInvitation : function() {
      return invitationCol.insertOne({invitation : Math.random().toString(36).slice(2, 10)});
    },
    listInvitation : function() {
      return invitationCol.find().toArray();
    },
    clearInvitation : function() {
      return invitationCol.deleteMany({});
    },
    newTable : function(account) {
      return new Promise((resolve, reject) => {
        paramCol.findOneAndUpdate({_id : "tableId"},
          {$inc: {value:1}},
          {upsert: true},
          function(error, result) {
            console.log(result);
            if (error) {
              reject(error);
              return;
            }
            var id = result.value.value;
            var item = {
              tableId : id,
              manager : account
            }
            tableCol.insertOne(item, function(err, r) {
              if (err) {
                reject(err);
              } else {
                resolve(item);
              }
            })
          }
        )
      })
    },
    listTable : function(start, num) {
      return tableCol.find({}).skip(start).limit(num).toArray();
    },
  }
}