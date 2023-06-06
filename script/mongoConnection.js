/* eslint-disable no-undef */
import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
export async function run(results) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.COLLECTION);
    console.log('You successfully connected to MongoDB!');
    
    //save all data
    if(process.env.SAVE_DATA_ALL.toLowerCase() === 'true') {
      const insertResult = await collection.insertMany(results);
      console.log('Inserted documents =>', insertResult);
    }
    
    
    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);
  } catch(e) {
    console.error(e);
  }
  finally {
    await client.close();
  }
}
