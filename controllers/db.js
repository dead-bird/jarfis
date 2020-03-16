require('dotenv').config({ path: '.env' });
const MongoClient = require('mongodb').MongoClient

module.exports = async () => {
    try {
        const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true };
        const database = await new MongoClient(process.env.DATABASEURL, connectOptions).connect();
        if (process.env.ENV === 'live' && database.db('jarfis')) {
            process.db = database.db('jarfis');
            console.log('Connected to live database');
        } else if (process.env.ENV === 'dev' && database.db('devfis')) {
            process.db = database.db('devfis');
            console.log('Connected to dev database');
        } else {
            console.log('I dont know what environment youre supposed to be on dude');
            console.log('No database connection established, exiting');
            process.exit(0);
        }
    } catch (err) {
        console.log(err);
    }
}