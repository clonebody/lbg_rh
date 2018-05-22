var data = new Array();
var param = new Array();

var makeSureTable = function(table) {
  if (!data[table]) {
    data[table] = new Array();
  }
  return data[table];
}

module.exports = {
  getCounter : function(countId) {
    if (!param[countId]) {
      param[countId] = 0;
    }
    param[countId]++;      
    return new Promise((resolve, reject) => {
      resolve(param[countId]);
    });
  },

  addItem : function(table, item) {
    console.log("add table" + table)
    console.log(item);
    return new Promise((resolve, reject) => {
      makeSureTable(table).push(item);
      resolve(item);
    });
  },

  deleteItem : function(table, item) {
    return new Promise((resolve, reject) => {
      var tarr = makeSureTable(table);
      for (key in tarr) {
        if (tarr[key].account == account) {
          tarr.splice(key, 1);
          resolve({});
          return;
        }
      }
    });
  },

  listItem : function(table, start, num) {
    return new Promise((resolve, reject) => {
      var tarr = makeSureTable(table);
      var ret = new Array();
      for (key in tarr) {
        if (start > 0) {
          start --;
          continue;
        }
        if (num > 0) {
          ret.push(tarr[key]);
          num--;
        } else {
          break;
        }
      }
      resolve(ret);
    });
  },

  findItem : function(table, item) {
    return new Promise((resolve, reject) => {
      var tarr = makeSureTable(table);
      var ret = new Array();
      for (ind in tarr) {
        var item = tarr[ind];
        var match = true;
        for (key in item) {
          if (item[key] != item[key]) {
            match = false;
            break;
          }
        }

        if (match) {
          ret.push(item);
        }
      }
      resolve(ret);
    });
  },

  findAndDeleteItem : function(table, item) {
    return new Promise((resolve, reject) => {
      var tarr = makeSureTable(table);
      var ret = new Array();
      for (ind in tarr) {
        var item = tarr[ind];
        var match = true;
        for (key in item) {
          if (item[key] != item[key]) {
            match = false;
            break;
          }
        }

        if (match) {
          tarr.splice(ind, 1);
          resolve({lastErrorObject : { n : 1}});
          break;
        }
      }
      resolve({lastErrorObject : { n : 0}});
    });
  },

  clearItem : function(table) {
    return new Promise((resolve, reject) => {
      data[table] = new Array();
      resolve({});
    });
  },
}
