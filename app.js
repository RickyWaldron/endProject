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
require("./routes/donate.js")(app, client)
require("./routes/searchCampaigns.js")(app, client)


app.get('/', (req, res) => {
	const queryUsers = {
                text:`CREATE TABLE IF NOT EXISTS users (user_id serial primary key,
                firstname text,
                lastname text, 
                email text,
                password text,
                age integer,
                streetaddress text,
                homenumber text,
                city text,
                latitude numeric,
                longitude numeric,
                picture text);`
        }
	const query = {
                text:`CREATE TABLE IF NOT EXISTS campaigns (campaign_id serial primary key,
                user_id integer REFERENCES users (user_id),
                title text,
                body text,
                goal integer,
                url text,
                email text,
                video text,
                streetaddress text,
                homenumber text,
                city text,
                latitude numeric,
                longitude numeric,
                pitch text,
                picture text,
                amountraised integer);`
        }
        client.query(queryUsers)
        	.then(result => {
        		client.query(query)
    				.then(result=>{
    					client.query(`SELECT * FROM campaigns`, (error, result)=>{
    						if (result.rows.length !== 0){
							let selectedCampaigns = result.rows
							client.query(`SELECT * FROM campaigns ORDER BY amountraised DESC LIMIT 3`,(error2, result2) => {
							let orderedCampaigns = result2.rows
							res.render("index", {id: req.session.user_id, selectedCampaigns: selectedCampaigns, orderedCampaigns: orderedCampaigns })
    						})
        				} else {
						res.render("index", {id: req.session.user_id})
    					}
    				
					})
        		})
			})
	})	

app.listen(port, () => {
    console.log("listening")
})

