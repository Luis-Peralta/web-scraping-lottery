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

async function connectMongo() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    console.log('\x1b[32mYou successfully connected to MongoDB!\x1b[0m');
    return db;
  } catch(e) {
    console.error(e);
  }
}

async function closeConnection() {
  await client.close();
  console.log('\x1b[33mConnection to MongoDB closed\x1b[0m');
}

async function getCollection() {
  const db = await connectMongo();
  return db.collection(process.env.COLLECTION);
}

/**
 * Function to save data on MongoDB
 * @param Array[Object] results - Array of objects with the results to save
 */
export async function saveData(results) {
  const collection = await getCollection();
  //data validation:::
  const findResult = await collection.find({ sorteo: results[0].sorteo }).toArray();
    
  //save data --- if the value is 0 it's because the data wasn't found
  if(findResult.length === 0) {
    const insertResult = await collection.insertMany(results);
    console.log('Inserted documents =>', insertResult);
  } else {
    console.log('\x1b[31mthe sorteo number already exists on the database!\ndocument/s found:\x1b[0m', findResult);
  }

  await closeConnection();
}

/**
 * Function to get data from MongoDB
 * @param Object query - Query to filter the results
 * @param Number limit - Limit of results to return
 * @returns Array[Object] - Array of objects with the results
 */
export async function getData({ query = {}, limit = 50 } = {}) {
  const collection = await getCollection();
  const findResult = await collection
    .find(query)
    .limit(limit)
    .sort({ _id: -1 }) // sort by newest
    .toArray();

  await closeConnection();
  return findResult;
}
