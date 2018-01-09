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
	app.get("/createCampaign", (req, res) => {
		if (req.session.user_id) {
			let id = req.session.user_id
			res.render("createCampaign", {id: req.session.user_id})
		}
		else {
			res.redirect("/")
		}	
	})
	app.post('/createCampaignForm', upload.single('campaignPicture'), function(req, res, next) {
		let id = req.session.user_id
		let pitch = req.body.pitch
		let email = req.body.email
		let goal = req.body.goal
		let title = req.body.title
		let body = req.body.body
		let video = req.body.video
		let city = req.body.city
		let streetAddress = req.body.streetAddress
		let homeNumber = req.body.homeNumber
		let websiteUrl = req.body.url
		let campaignPicture = req.file.filename
		console.log(req.file.filename)
		geocoder.geocode(streetAddress + homeNumber + city)
		  .then(function(result) {
		  	latitude = result[0].latitude
		  	longitude = result[0].longitude
		const query = {
				text: (`INSERT INTO campaigns (user_id, title, body, email, goal, url,
						video, streetaddress, homenumber, city, latitude, longitude, picture, pitch) 
						VALUES ('${id}', '${title}', '${body}', '${email}', '${goal}',
						'${websiteUrl}', '${video}', '${streetAddress}', '${homeNumber}', 
						'${city}', '${latitude}', '${longitude}', '${campaignPicture}', '${pitch}') RETURNING *`)
					}
			client.query(query, (error, result2) => {
			if (error) throw error
			res.redirect("/allCampaigns")
			})		
		})
	})
}							