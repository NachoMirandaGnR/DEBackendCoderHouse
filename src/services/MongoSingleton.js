import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(MONGO_URI);
  }
  static getInstance() {
    if (this.#instance) {
      return this.#instance;
    }
    console.error("No instance created");
    this.#instance = new MongoSingleton();
    return this.#instance;
  }
}
