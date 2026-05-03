const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

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

app.post("/register", (req, res) => {
    const users = JSON.parse(fs.readFileSync("./data/users.json"));

    const newUser = {
        id: Date.now(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    users.push(newUser);

    fs.writeFileSync("./data/users.json", JSON.stringify(users));

    res.send("User registered");
});

app.post("/login", (req, res) => {
    const users = JSON.parse(fs.readFileSync("./data/users.json"));

    const user = users.find(u => u.email === req.body.email);

    if(!user) return res.status(400).send("user not found");

    if(user.password !== req.body.password){
        return res.status(400).send("Invalid password");
    }

    const token = jwt.sign({id: user.id}, "secret");

    res.json({token});
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