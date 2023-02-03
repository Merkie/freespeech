import { MongoClient } from 'mongodb';
const client = new MongoClient(
	'mongodb+srv://archer:A6arlzJDBbsYtZuW@freespeech.90yuq.mongodb.net/?retryWrites=true&w=majority'
);
await client.connect();
export default client.db('freespeech'); // select database
