import mongoose from 'mongoose';
import config from '../../config.js';

// Define the Schema
const resultSchema = new mongoose.Schema({
  sorteo: { type: Number, required: true, unique: true },
  fecha: { type: String, required: true },
  results: { type: mongoose.Schema.Types.Mixed, required: true },
  pozo: { type: mongoose.Schema.Types.Mixed, required: true },
}, {
  // Disable automatic __v field to keep documents clean and matching the native driver insertions
  versionKey: false,
});

const collectionName = config.COLLECTION;

// Export the compiled model dynamically bound to the configured collection name
export const Result = mongoose.models.Result || mongoose.model('Result', resultSchema, collectionName);
