require('dotenv').load();

module.exports = (app, client) => {
	app.get("/donate", (req, res) => {
		res.render("oneCampaign")
	})
	app.post("/donate", (req, res) => {
		let contribution = req.body.contribution
		let campaignId = req.body.campaignId
		const query = {
			text: (`UPDATE campaigns set amountraised = Coalesce(amountraised, 0) + 
						'${contribution}' WHERE campaign_id='${campaignId}' RETURNING *`)
		}
		client.query(query, (error, result) => {
			let contributionSuccess = contribution
			let goal = result.rows[0].goal
			res.send({ contributionSuccess: contributionSuccess })
		})
	})
}