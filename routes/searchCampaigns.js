require('dotenv').load();

module.exports = (app, client) => {
    app.get('/searchCampaigns', (req, res) => {
        res.render("searchCampaigns")
    })  

    app.post('/searchCampaigns', (req, res) => {
            let suggest = req.body.searchedCampaign
            console.log(suggest)
            const query = {
                text: (`SELECT * FROM campaigns WHERE title ILIKE '%${suggest}%'`)
            }
            client.query(query, (error, result) => {
                if (error) throw error
                    console.log(result.rows[0])
                    campaign = result.rows[0]
                    console.log(campaign.title)
                    res.send(campaign)
                })
            })
}