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
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@$!%*?&]{8,}$/

async function getUsers() {
  const data = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(data);
}

app.post("/register", async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      const errors = {};

      if (!emailPattern.test(email)) {
        errors.email = "Invalid email fromat.";
      }

      if (!passwordPattern.test(password)) {
        errors.password = "Your password must include at least 1 digit, at least one lowercase letter, at least one uppercase letter and be minimum 8 characters long";
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords must match.";
      }

      if (!username || username.trim().length === 0) {
        errors.username = "You must provide your username.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(422).json(errors);
      }

      const users = await getUsers();
  
      const userExists = users.some(u => u.email === email);

      if (userExists) {
        return res.status(400).json({error: "User already exists"});
      }
      const hashedPass = await bcrypt.hash(password, 10);
  
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashedPass,
      };
  
      users.push(newUser);
      await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
  
      res.status(201).json({message: "User created successfully"});
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
});

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const users = await getUsers();
  
      const user = users.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({error: "Invalid credentials"});
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({error: "Invalid credentials"});
      }
  
      const token = jwt.sign({userId: user.id, email: user.email}, JWT_SECRET, {
        expiresIn: "24h",
      });
  
      res.json({ 
        token, 
        email: user.email, 
        username: user.username 
    });
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
});
  
app.listen(5000, () => {
    console.log("Auth server running on http://localhost:5000");
});
