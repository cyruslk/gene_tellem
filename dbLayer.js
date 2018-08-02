const MongoClient = require('mongodb').MongoClient;

module.exports = (url, dbName, collectionName) => {
  let db;
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
    }
    console.log('connected successfully to db');
    db = client.db(dbName);
  });

  const putOne = (data) => {
    const payload = {
      data,
    };
    const collection = db.collection(collectionName);
    return collection.insert(payload);
  }

  const getRandoms = (number) => {
    return new Promise((resolve, reject) => {
      const collection = db.collection(collectionName);
      collection.aggregate( [ { $sample: { size: Number(number) } } ]).toArray((err, result) => {
        resolve(result.map((item) => {
          return item.data;
        }))
      });
    })
  }

  return {
    putOne,
    getRandoms,
  }
}
