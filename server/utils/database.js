import { MongoClient } from 'mongodb';
import assert from 'assert';

const client = new MongoClient('mongodb+srv://uthdev_92:2VTSlV3uHROn2Bnu@cluster0-aqv1h.mongodb.net/development?retryWrites=true&w=majority', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

let db;

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to mongodb server");
    db = client.db();
    let r = await db.collection('inserts').insertOne({a:1});
    assert.equal(1, r.insertedCount);

    // Insert multiple documents
    let result = await db.collection('inserts').insertMany([{a:2}, {a:3}]);
    assert.equal(2, result.insertedCount);
    // Close connection
    return db;
  } catch (err) {
    console.log(err.stack);
  }
}


export default dbConnect;