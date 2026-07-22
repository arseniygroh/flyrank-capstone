const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const DB_PATH = path.join(__dirname, "data/users.json");
const JWT_SECRET = "super_secret_key"; 


console.log(DB_PATH);

async function getUsers() {
  const data = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(data);
}