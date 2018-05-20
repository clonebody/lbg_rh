var accountArray = new Array();
var invitationArray = new Array();
var tableArray = new Array();
var tableId = 0;

module.exports = {
  newAccount : function(invitation, item) {
    return new Promise((resolve, reject) => {
      accountArray.push(item);
      resolve(item);
    })
  },

  getAccount : function(account) {
    return new Promise((resolve, reject) => {
      var ret = new Array();
      for (key in accountArray) {
        var item = accountArray[key];
        if (item.account == account) {
          ret.push(item);
        }
      }
      resolve(ret);
    })
  },
  delAccount : function(account) {
    return new Promise((resolve, reject) => {
      for (key in accountArray) {
        if (accountArray[key].account == account) {
          accountArray.splice(key, 1);
          resolve({});
          return;
        }
      };
    });
  },
  listAccount : function(start, num) {
    return new Promise((resolve, reject) => {
      var ret = new Array();
      for (key in accountArray) {
        if (start > 0) {
          start --;
          continue;
        }
        if (num > 0) {
          ret.push(accountArray[key]);
          num--;
        } else {
          break;
        }
      }
      resolve(ret);
    })
  },
  newInvitation : function() {
    return new Promise((resolve, reject) => {
      var item = {invitation : Math.random().toString(36).slice(2)};
      invitationArray.push(item);
      resolve(item);
    })
  },  
  listInvitation : function() {
    return new Promise((resolve, reject) => {
      resolve(invitationArray);
    })
  },
  clearInvitation : function() {
    return new Promise((resolve, reject) => {
      invitationArray = new Array();
      resolve(invitationArray);
    })
  },
  newTable : function(account) {
    return new Promise((resolve, reject) => {
      var id = tableId++;
      for (key in accountArray) {
        var item = accountArray[key];
        if (item.account == account) {
          item.table = id;
          break;
        }
      }      
      var item = {
        tableId : id,
        manager : account
      }
      tableArray.push(item);
      resolve(item);
    })
  },
  listTable : function(start, num) {
    return new Promise((resolve, reject) => {
      var ret = new Array();
      for (key in tableArray) {
        if (start > 0) {
          start --;
          continue;
        }
        if (num > 0) {
          ret.push(tableArray[key]);
          num--;
        } else {
          break;
        }
      }
      resolve(ret);
    })
  },
}
