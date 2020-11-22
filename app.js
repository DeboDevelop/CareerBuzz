require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socket = require("./socket");
const settings = require("./settings");
const routes = require("./routes");

let DATABASE_URL = require("./keys").mongoURI;

// creating the http server
const app = express();
const server = http.Server(app);

mongoose.connect(DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// adding custom settings
settings(app);

// setting up the socket with node http server
socket(server);

// setting up the routes
routes(app);

server.listen(3000, console.log("Server is running at http://localhost:3000"));
