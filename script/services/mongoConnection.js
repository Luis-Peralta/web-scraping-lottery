import mongoose from 'mongoose';
import config from '../../config.js';
import { Result } from '../models/Result.js';

/**
 * Function to connect to MongoDB using Mongoose
 */
async function connectMongo() {
  try {
    await mongoose.connect(config.DB_URI, {
      dbName: config.DB_NAME,
    });
    console.log('\x1b[32mYou successfully connected to MongoDB using Mongoose!\x1b[0m');
  } catch (e) {
    console.error('Mongoose connection error:', e);
    throw new Error('Failed to connect to the database.');
  }
}

/**
 * Function to close the MongoDB connection
 */
async function closeConnection() {
  await mongoose.disconnect();
  console.log('\x1b[33mConnection to MongoDB closed\x1b[0m');
}

/**
 * Function to save data on MongoDB
 * @param {Array<{ sorteo: number }>} results - Array of objects with the results to save
 */
export async function saveData(results) {
  if (!results || results.length === 0) {
    return;
  }

  await connectMongo();

  try {
    // Check if the sorteo number already exists on the database
    const targetSorteo = results[0].sorteo;
    const findResult = await Result.find({ sorteo: targetSorteo }).lean();
      
    // Save data --- if the value is 0 it's because the data wasn't found
    if (findResult.length === 0) {
      const insertResult = await Result.insertMany(results);
      console.log('Inserted documents =>', insertResult);
    } else {
      console.log('\x1b[31mthe sorteo number already exists on the database!\ndocument/s found:\x1b[0m', findResult);
    }
  } catch (e) {
    console.error('Error in saveData:', e);
  } finally {
    await closeConnection();
  }
}

/**
 * Function to get data from MongoDB
 * @param {Object} params - Parameters for the query
 * @param {Object} [params.query] - Query to filter the results
 * @param {Number} [params.limit] - Limit of results to return
 * @returns {Promise<Array<{ sorteo: number, fecha: string, results: any, vacant: boolean|null, acumulado: number|null }>>} - Array of objects with the results
 */
export async function getData({ query = {}, limit = 50 } = {}) {
  await connectMongo();

  try {
    const findResult = await Result
      .find(query)
      .limit(limit)
      .sort({ _id: -1 }) // sort by newest
      .lean();

    return findResult;
  } catch (e) {
    console.error('Error in getData:', e);
    return [];
  } finally {
    await closeConnection();
  }
}
