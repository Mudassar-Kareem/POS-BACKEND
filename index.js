require("dotenv").config();
const { app } = require("./app");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL)
  .then((connection) => {
    console.log(`Server connected with MongoDB: ${connection.connection.name}`);
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });

// Create and start the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
