var invitationName = "invitation";
var accountName = "account";
var tableName = "table";

module.exports = function(dataOpr) {
  return {
    addInvitation : function() {
      return dataOpr.addItem(invitationName, {invitation : Math.random().toString(36).slice(2, 10)});
    },
    listInvitation : function(start, num) {
      return dataOpr.listItem(invitationName, start, num);
    },
    clearInvitation : function() {
      return dataOpr.clearItem(invitationName);
    },    

    addAccount : function(invitation, account, password) {
      return new Promise((resolve, reject) => {
        dataOpr.findItem(accountName, {account : account}).then((list) => {
          if (list.length != 0) {
            reject("用户已存在")
          } else {
            dataOpr.findAndDeleteItem(invitationName, {invitation : invitation}).then((ret) => {
              if ((account == process.env.ADMIN_ACCOUNT) || (ret.lastErrorObject.n == 1)) {
                var item = {
                  account : account,
                  password : password,
                  nickname : account,
                  admin : (account == process.env.ADMIN_ACCOUNT),
                }
                dataOpr.addItem(accountName, item).then(resolve, reject);
              } else {
                reject("邀请码无效");
              }
            })
          }          
        }, reject)
      })
    },
    delAccount : function(account) {
      return dataOpr.deleteItem(accountName, {account : account});
    },
    listAccount : function(start, num) {
      return dataOpr.listItem(accountName, start, num);
    },
    findAccount : function(account) {
      return dataOpr.findItem(accountName, {account : account});
    },

    addTable : function(account, tableName) {
      return new Promise((resolve, reject) => {
        dataOpr.getCounter("tableId")
        .then((tableId) => {
          var item = {
            _id : tableId,
            name : tableName,
            member : {},
          }
          item.member[account] = "creator";
          return dataOpr.addItem(tableName, item);
        }).then(resolve, reject);
      })
    },
    delTable : function(tableId) {
      return dataOpr.deleteItem(tableName, {_id:tableId});
    },
    listTable : function(start, num) {
      return dataOpr.listItem(tableName, start, num);
    },
    findTable : function(tableId) {
      return dataOpr.findItem(tableName, {_id : tableId});
    },    


/*
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
    */
  }
}