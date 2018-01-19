require('dotenv').load();

module.exports = (app, client) => {
	app.get("/allCampaigns", (req, res) => {
		let id = req.session.user_id
		const query = {
			text: (`SELECT * FROM campaigns`)
		}
		client.query(query, (error, result) => {
			let allCampaigns = result
			res.render("allCampaigns", { allCampaigns: allCampaigns, id: id })
		})
	})
	app.get("/oneCampaign", function(req, res) {
		let id = req.session.user_id
		let campaignId = req.query.id
		const query = {
			text: (`SELECT * FROM campaigns where campaign_id = '${campaignId}'`)
		}
		client.query(query, (error, result) => {
			let selectedCampaign = result.rows
			res.render("oneCampaign", { selectedCampaign: selectedCampaign, id: id })
		})
	})
}