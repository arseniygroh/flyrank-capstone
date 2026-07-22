const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const DB_PATH = path.join(__dirname, "data/users.json");
const PLAYLISTS_DB = path.join(__dirname, "data/playlists.json");
const JWT_SECRET = "super_secret_key"; 
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@$!%*?&]{8,}$/

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token) {
      return res.status(401).json({error: "Access denied. No token provided."});
    }
  
    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({error: "Invalid or expired token."});
      }
      req.user = decodedUser; 
      next(); 
    });
  }


async function getUsers() {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
}

async function getPlaylists() {
    const data = await fs.readFile(PLAYLISTS_DB, "utf8");
    return JSON.parse(data);
}
  
async function savePlaylists(playlists) {
    await fs.writeFile(PLAYLISTS_DB, JSON.stringify(playlists, null, 2));
}

app.get("/playlists", authenticateToken, async (req, res) => {
    try {
      const allPlaylists = await getPlaylists();
      const userPlaylists = allPlaylists.filter(p => p.userId === req.user.userId);
      res.json(userPlaylists);
    } catch (error) {
      res.status(500).json({error: "Failed to fetch playlists"});
    }
});

app.post("/playlists", authenticateToken, async (req, res) => {
    try {
      const { title, description, tracks = [] } = req.body;
      
      if (!title) {
        return res.status(422).json({error: "Playlist title is required."});
      }
      const playlists = await getPlaylists();
  
      const newPlaylist = {
        id: Date.now().toString(),
        userId: req.user.userId,
        title,
        description,
        tracks,
      };
  
      playlists.push(newPlaylist);
      await savePlaylists(playlists);
  
      res.status(201).json(newPlaylist);
    } catch (error) {
      res.status(500).json({error: "Failed to create playlist"});
    }
});

app.delete("/playlists/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      let playlists = await getPlaylists();

      const playlistIndex = playlists.findIndex(p => p.id === id);
      if (playlistIndex === -1) {
        return res.status(404).json({ error: "Playlist not found" });
      }
  
      if (playlists[playlistIndex].userId !== req.user.userId) {
        return res.status(403).json({ error: "Unauthorized to delete this playlist" });
      }

      playlists.splice(playlistIndex, 1);
      await savePlaylists(playlists);
  
      res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
});

app.put("/playlists/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const playlists = await getPlaylists();
  
      const playlistIndex = playlists.findIndex(p => p.id === id);
      
      if (playlistIndex === -1) {
        return res.status(404).json({ error: "Playlist not found" });
      }
  
      if (playlists[playlistIndex].userId !== req.user.userId) {
        return res.status(403).json({ error: "Unauthorized to edit this playlist" });
      }
  
      playlists[playlistIndex] = {
        ...playlists[playlistIndex],
        ...updatedData,
        id: playlists[playlistIndex].id, 
        userId: playlists[playlistIndex].userId 
      };
  
      await savePlaylists(playlists);
      res.json(playlists[playlistIndex]);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/playlists/:id/tracks", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { track } = req.body;
      const playlists = await getPlaylists();
  
      const playlist = playlists.find(p => p.id === id);
      
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }
  
      if (playlist.userId !== req.user.userId) {
        return res.status(403).json({ error: "Unauthorized to edit this playlist" });
      }

      const trackExists = playlist.tracks.some(t => t.trackId === track.trackId);
      if (trackExists) {
        return res.status(400).json({ error: "Track already exists in playlist" });
      }
  
      playlist.tracks.push(track);
      await savePlaylists(playlists);
  
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
});


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
  
app.listen(5001);
