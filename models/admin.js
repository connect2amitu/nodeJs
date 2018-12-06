//Define name of collection
const collectionName = "user";

//Define Collection schema
const collectionSchema = {
  name: { type: String, require: true },
  email: { type: String },
  password: { type: String },
  lastLoginDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
};

module.exports = require("./index")(collectionSchema, collectionName);
