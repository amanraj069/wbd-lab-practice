const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

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

app.listen(5000, () => console.log("Server running on port 5000"));