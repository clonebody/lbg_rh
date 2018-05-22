module.exports = function(conn) {
  return {
    getCounter = function(countId) {
      return conn.collection('param').findOneAndUpdate({_id : countId}, {$inc: {value:1}}, {upsert: true})
    },

    addItem : function(table, item) {
      return conn.collection(table).insertOne(item);
    },

    deleteItem : function(table, item) {
      return conn.collection(table).insertOne(item);
    },

    listItem : function(table, start, num) {
      return conn.collection(table).find({}).skip(start).limit(num).toArray();
    },

    findItem : function(table, item) {
      return conn.collection(table).find(item).toArray();
    },

    findAndDeleteItem : function(table, item) {
      return conn.collection(table).findOneAndDelete(item);
    },

    clearItem : function(table) {
      return conn.collection(table).deleteMany({});
    },
  }
}