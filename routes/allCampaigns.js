require('dotenv').load();

module.exports = (app, client) => {
	app.get("/allCampaigns", (req, res) => {
		const query = {
			text: (`SELECT * FROM campaigns`)
		}
		client.query(query, (error, result) => {
			let allCampaigns = result
			res.render("allCampaigns", {allCampaigns: allCampaigns})
		})
	})
}