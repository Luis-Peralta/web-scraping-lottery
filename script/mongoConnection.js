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
    console.log('\x1b[32mYou successfully connected to MongoDB!\x1b[0m');

    //data validation:::
    const findResult = await collection.find({ sorteo: results[0].sorteo }).toArray();
    
    //save data --- if the value is 0 it's because the data wasn't found
    if(findResult.length === 0) {
      const insertResult = await collection.insertMany(results);
      console.log('Inserted documents =>', insertResult);
    } else {
      console.log('\x1b[31mthe sorteo number already exists on the database!\ndocument/s found:\x1b[0m', findResult);
    }
    
  } catch(e) {
    console.error(e);
  }
  finally {
    await client.close();
  }
}
