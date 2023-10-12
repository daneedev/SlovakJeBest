const express = require('express');
const app = express();
const fs = require("fs")
let data = JSON.parse(fs.readFileSync(__dirname + "/data.json"));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    data = JSON.parse(fs.readFileSync(__dirname + "/data.json"));
    data.visitCount = data.visitCount + 1
    fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data)); 
    res.render(__dirname + "/views/index.ejs", { visitcount: data.visitCount})
})

app.get("/info", function (req, res) {
    res.render(__dirname + "/views/info.ejs")
})

app.get("/clicker", function (req, res) {
    res.render(__dirname + "/views/clicker.ejs", { clicks: data.clicks})
})

app.post('/click', (req, res) => {
    data = JSON.parse(fs.readFileSync(__dirname + "/data.json"));
    data.clicks++;
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    res.json({ clicks: data.clicks });
  });

app.listen(80,  () => {
    console.log("Server is running on port 80")
})