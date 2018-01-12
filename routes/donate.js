require('dotenv').load();

module.exports = (app, client) => {
		app.get("/donate", (req, res) => {
		})

		app.post("/donate", (req, res) => {
			let contribution = req.body.contribution
			console.log(contribution)
			let campaignId = req.body.campaignId
			console.log(campaignId)
			const query = {
				text: (`UPDATE campaigns set amountraised = Coalesce(amountraised, 0) + 
						'${contribution}' WHERE campaign_id='${campaignId}' RETURNING *`)
			}
			client.query(query, (error, result) => {
				let contributionSuccess = contribution
				let goal = result.rows[0].goal
				console.log(result.rows[0].amountraised)
				console.log(result.rows[0].goal)
				res.send({contributionSuccess: contributionSuccess, goal:goal})
			})
		})
	}

