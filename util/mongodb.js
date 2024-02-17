const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
    .then(async () => {
        // Check if the database exists
        const dbExists = await mongoose.connection.db.admin().listDatabases();
        const dbNames = dbExists.databases.map(db => db.name);
        
        if (!dbNames.includes('mydatabase')) {
            // If the database doesn't exist, create it
            await mongoose.connection.db.createCollection('mycollection'); // Create a dummy collection
            console.log('Database "mydatabase" created');
        }
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

module.exports = mongoose;
