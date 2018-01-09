//app.js
require('dotenv').load();
const express = require('express')
const app = express()
const fs = require('fs')
var session = require('express-session')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
const queryParser = require('query-parser')
const bcrypt = require('bcrypt')

var port = process.env.port

app.use(session({
    secret: process.env.secret
}));

const pg = require('pg')
const Client = pg.Client
const client = new Client({
    user: process.env.user,
    host: 'localhost',
    database: process.env.database,
    password: process.env.password,
    port: process.env.portdatabase,
})
client.connect()

app.set('view engine', 'pug')
app.use(express.static('public'))

require("./routes/signup.js")(app, client)
require("./routes/login.js")(app, client)
require("./routes/profile.js")(app, client)
require("./routes/createCampaign.js")(app, client)
require("./routes/allCampaigns.js")(app, client)

app.get('/', (req, res) => {
    res.render("index", {id: req.session.user_id})      
})

app.listen(port, () => {
    console.log("listening")
})

