require('dotenv').load();

var paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox',
  'client_id': 'process.env.paypalid',
  'client_secret': 'process.env.paypalsecret'
});


module.exports = (app, client) => {
		app.get("/donate", (req, res) => {
		})

		app.post("/donate", (req, res) => {
			var create_payment_json = {
			    "intent": "sale",
			    "payer": {
			        "payment_method": "paypal"
			    },
			    "redirect_urls": {
			        "return_url": "http://localhost:3000",
			        "cancel_url": "http://localhost:3000"
			    },
			    "transactions": [{
			        "item_list": {
			            "items": [{
			                "name": "req.body.campaignName",
			                "sku": "item",
			                "price": "req.body.contribution",
			                "currency": "USD",
			                "quantity": 1
			            }]
			        },
			        "amount": {
			            "currency": "USD",
			            "total": "1.00"
			        },
				        "description": "This is the payment description."
				    }]
				};
				paypal.payment.create(create_payment_json, function (error, payment) {
		   			if (error) {
		        		throw error;
		    		} else {
		       			console.log("Create Payment Response");
		        		console.log(payment);
		    			}
					});
			let contribution = req.body.contribution
			let campaignId = req.body.campaignId
			const query = {
				text: (`UPDATE campaigns set amountraised = Coalesce(amountraised, 0) + 
						'${contribution}' WHERE campaign_id='${campaignId}' RETURNING *`)
			}
			client.query(query, (error, result) => {
				let contributionSuccess = contribution
				let goal = result.rows[0].goal
				res.send({contributionSuccess: contributionSuccess, goal:goal})
			})
		})
	}

