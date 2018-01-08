require('dotenv').load();
const multer = require('multer')
var upload = multer({ dest: 'public/uploads/' })
var NodeGeocoder = require('node-geocoder');
 
            var options = {
              provider: 'google',
              httpAdapter: 'https', 
              apiKey: 'AIzaSyBCDnmxmEQFoz4ydD7kKiWBlwvf2lnZbAg', 
              formatter: null
            };
            var geocoder = NodeGeocoder(options);

module.exports = (app, client) => {
		app.get("/profile", (req, res) => {
			if (req.session.user_id) {
				let id = req.session.user_id
				const query = {
					text: (`SELECT * FROM users WHERE user_id='${id}'`)
				}
				client.query(query, (error, result) => {
					let userinfo = []
					userinfo.push(result)
					res.render("profile", {id: req.session.user_id, userinfo: userinfo})
							})
						}
				else {
				res.redirect("/")
				}	
			})
		app.post('/uploadPicture', upload.single('profilePicture'), function(req, res, next) {
			id = req.session.user_id
			let profilePicture = req.file.filename
			const query = { 
				text: (`UPDATE users SET picture='${profilePicture}' WHERE user_id='${id}' RETURNING *`) 
			}
			client.query(query, (error, result) => {
				if (error) throw error		
				res.redirect("/profile")
			})
		})
		app.post('/settings', function(req, res) {
			let id = req.session.user_id
			let email = req.body.email
			let firstname = req.body.firstname
			let lastname = req.body.lastname
			let age = req.body.age
			let streetAddress =req.body.streetAddress
			let homenumber = req.body.homeNumber
			let city = req.body.city
			console.log("the id" + id + "first" + firstname + "last" + lastname + "email" + email + "age" + age)	
			geocoder.geocode(streetAddress + homenumber + city)
			  .then(function(result) {
			  	latitude = result[0].latitude
			  	longitude = result[0].longitude
			  	const query = {
						text: 	(`UPDATE users SET 
								firstname='${firstname}', lastname='${lastname}', email='${email}', age='${age}',
								streetaddress='${streetAddress}', homenumber='${homenumber}', city='${city}',
								latitude='${latitude}', longitude='${longitude}' WHERE user_id='${id}' RETURNING *`) 
						}
							client.query(query, (error, result) => {
							if (error) throw error		
							res.redirect("/profile")
						})
					})
					.catch(function(err) {
					console.log(err);
				})
			})
		}