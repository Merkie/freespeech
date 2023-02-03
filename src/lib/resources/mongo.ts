import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017');
await client.connect();
export default client.db('freespeech'); // select database
