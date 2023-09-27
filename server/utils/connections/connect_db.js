// db.js

require('dotenv').config();
const mongoose = require('mongoose');

const pendingDatabaseOperations = [];
let isDbConnected = false;

/**
 * 
 * @param {Function} func 
 */
async function connectToDatabase(func) {
  try {

    console.log(process.env);

    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isDbConnected = true;

    // Process pending operations
    while (pendingDatabaseOperations.length > 0) {
      const operation = pendingDatabaseOperations.shift();
      await operation();
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (func) {
        pendingDatabaseOperations.push(func)
    }
  } 
}

async function shutdown() {
    try {
      // Close the database connection
      await mongoose.disconnect();
      console.log('Database connection closed');
      // Close other resources if needed
      // Perform any cleanup tasks
      process.exit(0); // Exit the Node.js process
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1); // Exit with an error code
    }
  }

module.exports = {
  connectToDatabase,
  shutdown,
  pendingDatabaseOperations,
};