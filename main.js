const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require('http').createServer(app);
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    res.sendFile(__dirname + '/lobby.html');
});


http.listen(3000,() => {
    console.log("Started on PORT 3000");
});