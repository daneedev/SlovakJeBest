const express = require('express');
const app = express();
const fs = require("fs")
let data = JSON.parse(fs.readFileSync(__dirname + "/data.json"));
const { rateLimit } = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10
})

const clickerLimiter = rateLimit({
    windowMs: 50,
    limit: 1
})

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get("/", limiter, function (req, res) {
    data = JSON.parse(fs.readFileSync(__dirname + "/data.json"));
    data.visitCount = data.visitCount + 1
    fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data)); 
    res.render(__dirname + "/views/index.ejs", { visitcount: data.visitCount})
})

app.get("/info", limiter, function (req, res) {
    res.render(__dirname + "/views/info.ejs")
})

app.get("/clicker", limiter, function (req, res) {
    res.render(__dirname + "/views/clicker.ejs", { clicks: data.clicks})
})

app.post('/click', clickerLimiter, (req, res) => {
    data = JSON.parse(fs.readFileSync(__dirname + "/data.json"));
    data.clicks++;
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.json({ clicks: data.clicks });
  });

app.listen(80,  () => {
    console.log("Server is running on port 80")
})