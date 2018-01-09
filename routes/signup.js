require('dotenv').load();
const bcrypt = require('bcrypt')
const multer = require('multer')
var upload = multer({ dest: 'public/uploads/' })

module.exports = (app, client) => {
		app.post('/signup', function(req, res) {
			let email = req.body.email
			let password = req.body.password
			let firstname = req.body.firstname
			let lastname = req.body.lastname
			const query = {
                  	text: (`SELECT * FROM users WHERE email='${email}'`)
                    }
				client.query(query, (error, result) => {
					if (error) throw error
						let ajax = req.body.ajax
						if (result.rows.length == 1){

						let existingUser = result.rows[0].email
						ajax = false	
						res.send({existingUser, ajax})		
						}	
					else {
						bcrypt.genSalt(10, function(error, result) {
						bcrypt.hash(password, result, function(err, hash) {
							const query2 = {
							text: (`INSERT INTO users (firstname, lastname, email, password) VALUES ('${firstname}', '${lastname}', '${email}', '${hash}') RETURNING *`)
							}
							client.query(query2, (error, result) => {
								if (error) throw error
									console.log(result.rows[0].user_id)
								req.session.user_id = result.rows[0].user_id
								id = req.session.user_id
								firstname = result.rows[0].firstname
								res.send({id, firstname})
								})
							})
						})				
					}	
				})
			})
	}

		