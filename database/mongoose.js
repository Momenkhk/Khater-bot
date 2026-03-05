const mongoose = require('mongoose');

module.exports = async function connectDatabase(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    maxPoolSize: 30,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 10000
  });
  console.log('[DATABASE] MongoDB connected');
};
