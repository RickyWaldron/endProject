require('dotenv').load();

module.exports = (app, client) => {
	app.get('/searchCampaigns', (req, res) => {
		let id = req.session.user_id
		res.render("searchCampaigns", { id: id })
	})

	app.post('/searchCampaigns', (req, res) => {
		let suggest = req.body.searchedCampaign
		const query = {
			text: (`SELECT * FROM campaigns WHERE title ILIKE '%${suggest}%'`)
		}
		client.query(query, (error, result) => {
			if (error) throw error
			campaign = result.rows
			res.send(campaign)
		})
	})
}