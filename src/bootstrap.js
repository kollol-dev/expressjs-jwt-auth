const mongoose = require("mongoose");
const {
  app: { database: databaseDriver },
  mongo: { url },
} = require("./config/environments");

const connectMongoDb = async () => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.error(error);
  }
};

const dbMapper = {
  "MONGODB": connectMongoDb,
};

(async function connectDb() {
  await dbMapper[databaseDriver.toUpperCase()]();
  console.info(`Connected to ${databaseDriver}`);
})();
