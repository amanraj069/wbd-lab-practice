const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const DATA_PATH = "./data/users.json";
const JWT_SECRET = "secret";

app.use(cors());
app.use(express.json());

const readUsers = () => {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify([]));
  }
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw || "[]");
};

const writeUsers = (users) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
};

function auth(req, res, next){
    const token = req.headers.authorization;

    if(!token) return res.status(401).send("No token");

    try{
        const decoded = require("jsonwebtoken").verify(token, "secret");
        req.user = decoded;
        next();
    } catch {
        res.status(401).send("Invalid token");
    }
}

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const users = readUsers();
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    writeUsers(users);

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const users = readUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post("/events", auth, (req, res) => {
    const events = JSON.parse(fs.readFileSync("./data/events.json"));

    const newEvent = {
        id: Date.now(),
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        createdBy: req.user.id
    };

    events.push(newEvent);

    fs.writeFileSync("./data/events.json", JSON.stringify(events));

    res.send("Event created");
});

app.get("/events", (req, res) => {
    const events = JSON.parse(fs.readFileSync("./data/events.json"));
    res.json(events);
});

app.get("/event/:id", (req, res) => {
    const events = JSON.parse(fs.readFileSync("./data/events.json"));
    const event = events.find(e => e.id === req.params.id);

    if(!event) return res.status(404).send("Not found");
    
    res.json(event);
});

app.put("/events/:id", auth, (req, res) => {
    let events = JSON.parse(fs.readFileSync("./data/events.json"));

    events = events.map(e => 
        e.id == req.params.id ? {...e, ...req.body} : e
    );

    fs.writeFileSync("./data/events.json", JSON.stringify(events));

    res.send("Updated");
});

app.delete("/events/:id", auth, (req, res) => {
    let events = JSON.parse(fs.readFileSync("./data/events.json"));

    events = events.filter(e => e.id != req.params.id);

    fs.writeFileSync("./data/events.json", JSON.stringify(events));

    res.send("Deleted");
})

app.listen(5000, () => console.log("Server running on port 5000"));
